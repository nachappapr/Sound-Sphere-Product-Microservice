import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import {
  Product,
  type ProductDoc,
  type ProductAttrs,
} from "../model/products.model";

export const createProduct = async (
  attrs: ProductAttrs
): Promise<ProductDoc> => {
  const product = Product.build(attrs);
  await product.save();
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
