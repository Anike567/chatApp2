const Redis = require("ioredis");
const dotenv = require('dotenv');

dotenv.config();


const master = new Redis(process.env.REDIS_URL);
const pubClient = new Redis(process.env.REDIS_URL);
const subClient = pubClient.duplicate();

master.on('error',(err)=>console.log(`Master Redis connection failed ${err}`));
pubClient.on('error', (err)=>console.log(`Redis pulisher connection failes ${err}`));


module.exports = { master, pubClient, subClient };
