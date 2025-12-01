const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const socketHandler = require('./socket/socketHandler.js');
const { AppDataSource } = require('./config/data-source.js');
const publicHandler = require('./socket/publicSocketHandle.js');
const { master, pubClient, subClient } = require('./config/redis.js');
const { connectToRabbitMqServer, initRabbitPublisher } = require('./config/rabbitMq.js');
const {connectConsumer} = require('./config/rabbitConsumer.js');
const { messageScheduler } = require('./utility/messageScheduler.js');



const streamName = "sent-messages";
const streamSizeRetention = 5 * 1e9;

let rabbitmqClient;
require('dotenv').config();

const app = express();


AppDataSource.initialize()
  .then(() => {
    console.log("connected to database successully");
    messageScheduler();
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
//save messages in batch



//connect to rabbitmq server 

//consumer
connectConsumer()

//Producer
connectToRabbitMqServer()
  .then(async (client) => {
    console.log("connected to rabbitMq server successfully");

    rabbitmqClient = client;

    // Create stream
    await client.createStream({
      stream: streamName,
      arguments: { "max-length-bytes": streamSizeRetention }
    });
    await initRabbitPublisher();
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




module.exports.publisher = async()=>{
  await rabbitmqClient.declarePublisher({
      stream: streamName
    });
};