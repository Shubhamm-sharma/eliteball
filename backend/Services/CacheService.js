const { createClient } = require("redis");

const LIVE_STATE_TTL = 60; // seconds
const redisUrl = process.env.REDIS_URL;

const client = redisUrl ? createClient({ url: redisUrl }) : null;
let clientReadyPromise = null;

if (client) {
  client.on("error", (err) => console.error("Redis error:", err.message));
  clientReadyPromise = client.connect().catch((err) => {
    console.error("Redis connection failed:", err.message);
    return null;
  });
}

const withClient = async (operation, fallback = null) => {
  if (!client) return fallback;

  try {
    await clientReadyPromise;
    if (!client.isOpen) return fallback;
    return await operation(client);
  } catch (err) {
    console.error("Redis operation failed:", err.message);
    return fallback;
  }
};

module.exports = {
  async getLiveState(matchId) {
    const data = await withClient((redisClient) =>
      redisClient.get(`match:live:${matchId}`),
    );
    return data ? JSON.parse(data) : null;
  },

  async setLiveState(matchId, state) {
    await withClient((redisClient) =>
      redisClient.setEx(
        `match:live:${matchId}`,
        LIVE_STATE_TTL,
        JSON.stringify(state),
      ),
    );
  },

  async invalidateLiveState(matchId) {
    await withClient((redisClient) => redisClient.del(`match:live:${matchId}`));
  },
};
