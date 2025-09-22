const Redis = require("ioredis");

// Use the full Redis URL directly
const master = new Redis("redis://default:4lsv1WXfaNsZn65w1DOTyEbsVgQiJVn5@redis-14506.crce179.ap-south-1-1.ec2.redns.redis-cloud.com:14506");

master.on("connect", () => console.log("✅ Redis connected"));
master.on("error", (err) => console.error("Redis error:", err));

module.exports = { master };
