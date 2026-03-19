// Redis client
import { createClient } from "redis";
const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

class RedisClient {
  async saveContent(id, data) {
    // Salva o content no Redis
    await client.set(id, data, { expiration: 3600 });
  }

  async getContent(id) {
    return await client.get(id);
  }
}

export const redisClient = new RedisClient();
