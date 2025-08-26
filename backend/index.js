const express = require('express');
const http = require('http');
const{Server} = require('socket.io');
const userRouter = require('./authController/authContoller.js');
const cors = require('cors');
const socketHandler = require('./socket/socketHandler.js');
const path = require('path');
const fs = require('fs');

const{closeLoggerStream} = require('./utility/logger.js');




const app = express();



const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin :'*',
        methods:['GET', 'POST']
    }
});



app.use(cors());


app.use(express.json());



app.use(()=>{

})





socketHandler(io);

server.listen(3000, () => {
    console.log('Server is up and running on port 3000');
});




["SIGINT", "SIGTERM"].forEach(signal => {
  process.on(signal, () => {
    closeLoggerStream(); 

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
