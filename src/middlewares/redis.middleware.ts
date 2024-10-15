import { type NextFunction, type Request, type Response } from "express";
import { getCache } from "../utils/redis-client";

export const cacheMiddleware =
  (keyGenerator: (req: Request) => string, ttl: number, message: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const cachedData = await getCache(key);
    if (cachedData) {
      return res.status(200).send({
        message,
        data: JSON.parse(cachedData),
      });
    }

    next();
  };
