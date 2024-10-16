import {
  NotFoundError,
  currentUser,
  errorHandler,
  morganMiddleware,
} from "@soundspheree/common";
import express from "express";
import "express-async-errors";

import cookieSession from "cookie-session";
import cors from "cors";
import { config } from "dotenv";
import { productsRouter } from "./routes/products.routes";

// add the cron
// import "./cron/publish-failed-events";

if (process.env.NODE_ENV === "test") {
  config({ path: `.env.${process.env.NODE_ENV}` });
} else {
  config();
}

// create express app
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());

// express middleware to handle cookies
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

// add morgan middleware
app.use(morganMiddleware);

// express middleware to handle current user
app.use(currentUser);

// express middleware to handle routes
app.get("/api/products/health", (req, res) => {
  res.send("OK");
});

app.use("/api/products", productsRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// express middleware to handle errors
app.use(errorHandler);

export { app };
