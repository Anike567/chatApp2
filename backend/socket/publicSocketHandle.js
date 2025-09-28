const loginHandler = require('./login');

const publicHandler = (io)=>{
    
    io.of("/auth").on("connection", (socket)=>{
        console.log(socket.id)

        socket.on('loginEvent', (user, callback) => {
            loginHandler(user, socket, callback);
        });
    })

    
}

module.exports = publicHandler;