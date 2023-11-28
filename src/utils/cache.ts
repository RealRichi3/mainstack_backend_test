import redisClient from "../database/redis";

class CacheUtil {
    static async saveToCache({ key, value, ttl }: { key: string, value: any, ttl?: number }) {
        ttl
            ? await redisClient.setex(key, JSON.stringify(value), ttl)
            : await redisClient.set(key, JSON.stringify(value));
    }

    static async getFromCache(key: string) {
        return await redisClient.get(key);
    }

    static async deleteFromCache(key: string) {
        await redisClient.del(key);
    }
}

export default CacheUtil;