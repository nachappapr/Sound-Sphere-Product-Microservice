import {
  NotAuthorizedError,
  NotFoundError,
  publish,
} from "@soundspheree/common";
import { Request, Response } from "express";
import {
  CreateProductInput,
  FindProductInput,
  UpdateProductInput,
} from "../scheme/products.schema";
import {
  createProduct,
  findProductById,
  findProducts,
  updateProduct,
} from "../service/products.service";
import { ProductEvent, ProductKafkaConfig } from "../types";

export const createProductsHandler = async (
  req: Request<unknown, unknown, CreateProductInput>,
  res: Response
) => {
  try {
    const product = await createProduct({
      ...req.body,
      userId: req?.currentUser!.id,
    });

    // publish to kafka
    await publish({
      topic: ProductKafkaConfig.PRODUCT_TOPIC,
      event: ProductEvent.PRODUCT_CREATED,
      message: {
        id: product._id,
      },
    });

    res.status(201).send({
      message: "product created",
      data: product,
    });
  } catch (error) {
    throw new Error("Error creating product");
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

  res.status(200).send({
    message: "product details",
    data: product,
  });
};

export const findProductsHandler = async (req: Request, res: Response) => {
  const products = await findProducts();

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

  res.status(200).send({
    message: "product updated",
    data: updatedProduct,
  });
};
