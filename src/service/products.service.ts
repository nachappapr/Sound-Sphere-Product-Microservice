import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import {
  Product,
  type ProductAttrs,
  type ProductDoc,
} from "../model/products.model";

export const createProduct = async (
  attrs: ProductAttrs,
  session?: mongoose.mongo.ClientSession
): Promise<ProductDoc> => {
  const product = Product.build(attrs);
  await product.save({ session });
  return product;
};

export const findProductById = async (
  filterId: FilterQuery<ProductDoc>["id"],
  queryOptions?: QueryOptions
) => {
  return await Product.findById(filterId, queryOptions ?? {});
};

export const findProducts = async (queryOptions?: QueryOptions) => {
  return await Product.find({}, queryOptions ?? {});
};

export const updateProduct = async (
  query: FilterQuery<ProductDoc>,
  update: UpdateQuery<ProductDoc>,
  queryOptions?: QueryOptions
) => {
  return await Product.findOneAndUpdate(query, update, queryOptions ?? {});
};
