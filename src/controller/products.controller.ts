import {
  logger,
  NotAuthorizedError,
  NotFoundError,
  PublishType,
  RequestFailureError,
} from "@soundspheree/common";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { ProductCreatedProducer } from "../message-broker/events/publisher/product-created-publisher";
import { kafkaClient } from "../message-broker/kakfa-wrapper";
import {
  CreateProductInput,
  FindProductInput,
  UpdateProductInput,
} from "../scheme/products.schema";
import { createEvent } from "../service/events.service";
import {
  createProduct,
  findProductById,
  findProducts,
  updateProduct,
} from "../service/products.service";
import { ProductDataType, ProductEvent, ProductKafkaConfig } from "../types";
import { invalidateCache, setCache } from "../utils/redis-client";

type ProductPublishType = PublishType<
  ProductEvent.PRODUCT_CREATED,
  ProductKafkaConfig.PRODUCT_TOPIC,
  ProductDataType
>;

export const createProductsHandler = async (
  req: Request<unknown, unknown, CreateProductInput>,
  res: Response
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // save product
    const product = await createProduct(
      {
        ...req.body,
        userId: req?.currentUser!.id,
      },
      session
    );

    // invalidate cache
    await invalidateCache(`product-${product.id}`);
    await invalidateCache(`products-all`);

    const event: ProductPublishType = {
      topic: ProductKafkaConfig.PRODUCT_TOPIC,
      event: ProductEvent.PRODUCT_CREATED,
      message: {
        id: product.id,
        price: product.price,
        title: product.title,
      },
    };

    // save event to mongodb
    const productCreatedEvent = await createEvent(
      {
        ...event,
        status: "failed",
      },
      session
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // publish to kafka
    try {
      await new ProductCreatedProducer(kafkaClient).publish({
        event: ProductEvent.PRODUCT_CREATED,
        message: {
          id: product.id,
          title: product.title,
          price: product.price,
        },
        topic: ProductKafkaConfig.PRODUCT_TOPIC,
      });
      productCreatedEvent.status = "success";
    } catch (error) {
      productCreatedEvent.status = "failed";
      logger.error("Error publishing product created event:", error);
    } finally {
      await productCreatedEvent.save();
    }

    res.status(201).send({
      message: "product created",
      data: product,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new RequestFailureError("Failed to create product", 500);
  }
};

export const findProductHandler = async (
  req: Request<FindProductInput, unknown, unknown, unknown>,
  res: Response
) => {
  const { id } = req.params;

  const product = await findProductById(id);

  if (!product) {
    throw new NotFoundError();
  }

  // Store the product in cache with expiration time
  // by default expiration time is 1hourt
  await setCache(`product-${id}`, JSON.stringify(product));

  res.status(200).send({
    message: "product details",
    data: product,
  });
};

export const findProductsHandler = async (req: Request, res: Response) => {
  const products = await findProducts();

  // Store the product in cache with expiration time
  // by default expiration time is 1hourt
  await setCache(`products-all`, JSON.stringify(products));

  res.status(200).send({
    message: "products details",
    data: products,
  });
};

export const updateProductsHandler = async (
  req: Request<
    UpdateProductInput["params"],
    unknown,
    UpdateProductInput["body"]
  >,
  res: Response
) => {
  const { id } = req.params;
  const product = await findProductById(id);
  const userId = req?.currentUser!.id;
  if (!product) {
    throw new NotFoundError();
  }
  if (product.userId?.toString() !== userId) {
    throw new NotAuthorizedError();
  }
  const updatedProduct = await updateProduct({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  // invalidate cache
  await invalidateCache(`product-${updatedProduct?.id}`);
  await invalidateCache(`products-all`);

  res.status(200).send({
    message: "product updated",
    data: updatedProduct,
  });
};
