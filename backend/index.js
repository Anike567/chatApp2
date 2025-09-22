const express = require('express');
const http = require('http');
const{Server} = require('socket.io');
const userRouter = require('./authController/authContoller.js');
const cors = require('cors');
const socketHandler = require('./socket/socketHandler.js');
const path = require('path');
const {AppDataSource} = require('./config/data-source.js');

const{closeLoggerStream} = require('./utility/logger.js');
const saveOfflineMessage = require('./utility/saveMessageForOfflineUser.js');

const messages = require('./entity/messageStore.js');


const app = express();

AppDataSource.initialize()
  .then(()=>{
    console.log("connected to database successully");
  })
  .catch((err)=>{
    console.log(err);
  })
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin :'*',
        methods:['GET', 'POST']
    }
});



app.use(cors());


app.use(express.json());


socketHandler(io);

server.listen(3000, () => {
    console.log('Server is up and running on port 3000');
});




["SIGINT", "SIGTERM","uncaughtException", "unhandledRejection"].forEach(signal => {
  process.on(signal, () => {
    closeLoggerStream(); 
    if(messages.length > 0){
      saveOfflineMessage(messages);
    }


    if (server) {
      server.close(() => {
        console.log(`Server closed successfully due to ${signal}`);
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});




module.exports = messages;