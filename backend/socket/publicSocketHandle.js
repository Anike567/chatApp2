const loginHandler = require('./login');
const signupHandler = require('./signup');

const publicHandler = (io)=>{
    
    io.of("/auth").on("connection", (socket)=>{
        console.log(socket.id)

        socket.on('loginEvent', (user, callback) => {
            loginHandler(user, socket, callback);
        });

        socket.on('signupEvent', (data, cb) => { signupHandler(data, cb) });
    })

    
}

module.exports = publicHandler;