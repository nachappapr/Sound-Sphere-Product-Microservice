import { RedisCache } from "@soundspheree/common";
const redisHost = process.env.REDIS_HOST!;
const redisPort = parseInt(process.env.REDIS_PORT!);

const cache = new RedisCache(redisHost, redisPort);
const redisClient = cache.redisClient;
export const { getCache, invalidateCache, setCache } = cache;
export default redisClient;
