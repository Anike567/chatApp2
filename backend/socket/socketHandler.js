const connectionPool = require('./../config/connection');

const socketHandler = (io) => {
    io.on('connection', (socket) => {
    

        socket.on('message-received', (data) => {
            socket.broadcast.emit('message-received', data);
        });

        socket.on('loginEvent', (user) => {
            const query = 'SELECT * FROM users WHERE username = ?';

            connectionPool.query(query, [user.username], (error, results) => {
                if (error) {
                    console.error('Query error:', error);
                    return socket.emit('loginErrorEvent', {
                        error: 'Internal Server Error',
                    });
                }

                if (!results || results.length === 0) {
                    return socket.emit('loginMessageEvent', {
                        message: 'Username not found, please sign up',
                    });
                }

                const dbUser = results[0];

                if (dbUser.password !== user.password) {
                    return socket.emit('loginMessageEvent', {
                        message: 'Incorrect password',
                    });
                }

                socket.emit('loginSuccessEvent', {
                    message: {
                        loggedIn: true,
                        user: dbUser,
                    }
                });
            });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected with socket ID: ${socket.id}`);
        });
    });
};

module.exports = socketHandler;
