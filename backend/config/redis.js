const Redis = require('ioredis');
const redis = new Redis(); // defaults to localhost:6379

module.exports = redis;
