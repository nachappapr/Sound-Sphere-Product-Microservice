import { requireAuth, validateResource } from "@soundspheree/common";
import express from "express";
import {
  createProductsHandler,
  findProductsHandler,
  findProductHandler,
  updateProductsHandler,
} from "../controller/products.controller";
import {
  CreateProductSchema,
  FindProductSchema,
  UpdateProductSchema,
} from "../scheme/products.schema";

const router = express.Router();

// POST /api/products
router.post(
  "/",
  requireAuth,
  validateResource(CreateProductSchema),
  createProductsHandler
);

// GET /api/products/:id
router.get("/:id", validateResource(FindProductSchema), findProductHandler);

// GET /api/products
router.get("/", findProductsHandler);

// Put /api/products/:id
router.put(
  "/:id",
  requireAuth,
  validateResource(UpdateProductSchema),
  updateProductsHandler
);

export { router as productsRouter };
