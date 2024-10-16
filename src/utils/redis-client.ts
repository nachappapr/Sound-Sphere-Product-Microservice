import { RedisCache } from "@soundspheree/common";

const cache = new RedisCache("sound-sphere-products-redis-master", 6379);
const redisClient = cache.redisClient;
export const { getCache, invalidateCache, setCache } = cache;
export default redisClient;
