import { object, z } from "zod";

const ProductSchema = object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title must be at most 50 characters long"),
  description: z
    .string({ required_error: "Description is required" })
    .min(3, "Description must be at least3 characters long"),
  category: z.string({ required_error: "Category is required" }),
  inventory_count: z
    .number({ required_error: "Inventory count is required" })
    .int({ message: "Inventory count must be an integer" })
    .positive({ message: "Inventory count must be positive" }),
  imageUrl: z.string({ required_error: "Image URL is required" }),
  price: z
    .number({ required_error: "Price is required" })
    .gt(0, "Price must be greater than 0"),
});

export const CreateProductSchema = object({
  body: ProductSchema,
});

export const FindProductSchema = object({
  params: object({
    id: z.string({ required_error: "Id is required" }),
  }),
});

export const UpdateProductSchema = object({
  body: ProductSchema,
  params: object({
    id: z.string({ required_error: "Id is required" }),
  }),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>["body"];
export type FindProductInput = z.infer<typeof FindProductSchema>["params"];
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
