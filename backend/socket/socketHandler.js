const socketHandler = (io) =>{
    io.on('connection',(socket)=>{
        console.log(`user connected with socket id ${socket.id}`);
    })
}

module.exports = socketHandler;