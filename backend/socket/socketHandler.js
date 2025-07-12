

const getUserHandler = require('./getUserHandler');
const loginHandler = require('./login');
const signupHandler = require('./signup');

const socketHandler = (io) => {
    io.on('connection', (socket) => {


        socket.on('message-received', (data) => {
            socket.broadcast.emit('message-received', data);
        });

        socket.on('loginEvent', (user) => {
            loginHandler(user, socket);
        });



        // signup event handler 

        socket.on('signupEvent', (data) => { signupHandler(data, socket) });


        socket.on('getuser', async (data, callback) => {
            try {
                const users = await getUserHandler(data, socket);

                if (!users) {
                    return callback({ message: { users: [] } });
                }

                callback({ message: { users } });
            } catch (err) {
                console.error(err);
                callback({ message: { users: [], error: 'Internal server error' } });
            }
        });


        socket.on('disconnect', () => {
            console.log(`${socket.id} is diconnected`);
        })

    });
};

module.exports = socketHandler;
