import mongoose from "mongoose";

// properties of a product
export interface ProductAttrs {
  title: string;
  price: number;
  description: string;
  category: string;
  inventory_count: number;
  imageUrl: string;
  userId: string;
}

// properties of a ticket document
export interface ProductDoc extends mongoose.Document, ProductAttrs {}

// properties of a ticket model
export interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    inventory_count: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ProductSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Ticket",
  ProductSchema
);
export { Product };
