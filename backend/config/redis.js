const Redis = require("ioredis");
const dotenv = require('dotenv');

dotenv.config();


const master = new Redis(process.env.REDIS_URL);

master.on("connect", () => console.log("✅ Redis connected"));
master.on("error", (err) => console.error("Redis error:", err));

module.exports = { master };
