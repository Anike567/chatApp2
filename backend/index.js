const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const socketHandler = require('./socket/socketHandler.js');
const { AppDataSource } = require('./config/data-source.js');
const publicHandler = require('./socket/publicSocketHandle.js');
const { master, pubClient, subClient } = require('./config/redis.js');
const { connectToRabbitMqServer } = require('./config/rabbitMq.js');
const streamName = "sent-messages";
const streamSizeRetention = 5 * 1e9;

let rabbitmqClient;
let publisher;
require('dotenv').config();

const app = express();


AppDataSource.initialize()
  .then(() => {
    console.log("connected to database successully");
  })
  .catch((err) => {
    console.log(err);
  })
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


// connect to redis server

master.on("connect", () => {
  console.log("Master connected to the Redis server")
});

pubClient.on("connect", () => {
  console.log("Publisher connection also established with Redis server");
  subClient.subscribe("global_channel");
})

master.on("error", (err) => console.error("Redis error:", err));

//connect to rabbitmq server 

connectToRabbitMqServer()
  .then(async (client) => {
    console.log("connected to rabbitMq server successfully");

    rabbitmqClient = client;

    // Create stream
    await rabbitmqClient.createStream({
      stream: streamName,
      arguments: { "max-length-bytes": streamSizeRetention }
    });

    // Create publisher
    publisher = await rabbitmqClient.declarePublisher({
      stream: streamName
    });

    console.log("RabbitMQ stream ready");
  })
  .catch((err) => {
    console.log("RabbitMQ error:", err);
  });
// seperate public socket connection for authentication and signup

publicHandler(io);
socketHandler(io);

server.listen(4000, () => {
    console.log('Server is up and running on port 4000');
});




module.exports = {publisher};