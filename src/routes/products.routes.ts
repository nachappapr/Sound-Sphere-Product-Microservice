import { requireAuth, validateResource } from "@soundspheree/common";
import express from "express";
import {
  createProductsHandler,
  findProductHandler,
  findProductsHandler,
  updateProductsHandler,
} from "../controller/products.controller";
import { cacheMiddleware } from "../middlewares/redis.middleware";
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
router.get(
  "/:id",
  validateResource(FindProductSchema),
  cacheMiddleware((req) => `product-${req.params.id}`, 3600, "product-details"),
  findProductHandler
);

// GET /api/products
router.get(
  "/",
  cacheMiddleware((req) => `products-all`, 3600, "product-details"),
  findProductsHandler
);

// Put /api/products/:id
router.put(
  "/:id",
  requireAuth,
  validateResource(UpdateProductSchema),
  updateProductsHandler
);

export { router as productsRouter };
