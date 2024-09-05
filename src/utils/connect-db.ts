import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect("mongodb://products-mongo-srv:27017/products");
};
