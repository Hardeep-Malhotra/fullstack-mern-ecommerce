import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("connect", () => console.log("🟢 Redis connecting..."));
redisClient.on("ready", () => console.log("🟢 Redis Connected & Ready!"));
redisClient.on("error", (err) => console.error("🔴 Redis Error:", err.message));

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (error) {
        console.error("🔴 Redis connection failed:", error.message);
    }
};

export default redisClient;
