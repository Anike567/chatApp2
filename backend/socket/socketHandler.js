const redis = require('../config/redis');
const getUserHandler = require('./getUserHandler');
const loginHandler = require('./login');
const signupHandler = require('./signup');
const connectionPool = require('./../config/connection');

const socketHandler = (io) => {
    io.on('connection', (socket) => {

        socket.on('updateSocketId', (data) => {
            
            const { userId, socketid } = data;
            console.log(socketid, socketid);
            redis.set(userId, socketid);
            redis.set(socket.id, userId);
        });

        socket.on('getMessages', (data, callback) => {
            const { from, to } = data;
            const query = `
                            SELECT * FROM message 
                            WHERE (\`from\` = ? AND \`to\` = ?) 
                                OR (\`from\` = ? AND \`to\` = ?)
                            `;

            connectionPool.query(query, [from, to, to, from], (error, results) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log
                    callback(results);
                }
            });
        });

        socket.on('saveMessage', (data) => {
            //         const messages = data.map((m) => [m.to, m.from, m.message]);

            //         // You can now use this to bulk insert into MySQL
            //         const sql = `
            //     INSERT IGNORE INTO message (\`to\`, \`from\`, message)
            //     VALUES ?
            // `;
            //         db.query(sql, [messages], (err, result) => {
            //             if (err) {
            //                 console.error('Error inserting messages:', err);
            //             } else {
            //                 console.log('Inserted messages:', result.affectedRows);
            //             }
            //         });

            console.log(data);
        });


        socket.on('message-received', async (data) => {
            try {
                const socketId = await redis.get(data.to);
                if (socketId) {
                    io.to(socketId).emit('message-received', data);
                } else {
                    console.warn(`No socket ID found for user ${data.to}`);
                }
            } catch (error) {
                console.error('Redis error:', error);
            }
        });
        //login event handler
        socket.on('loginEvent', (user, callback) => {

            loginHandler(user, socket, callback);
        });



        // signup event handler 

        socket.on('signupEvent', (data) => { signupHandler(data, socket) });

        socket.on('getuser', async (data, callback) => {
            try {
                const users = await getUserHandler(data, socket);

                if (!users) {
                    socket.emit('tokenExpiresEvent', { error: 'Token expired. Please login again' });
                    return callback({ message: { users: [] } });
                }

                callback({ message: { users } });
            } catch (err) {
                console.error(err);
                callback({ message: { users: [], error: 'Internal server error' } });
            }
        });




        socket.on('disconnect', async () => {
            console.log(`${socket.id} get disconnected`);
            const userId = await redis.get(socket.id);
            if (userId) {
                await redis.del(userId);
                await redis.del(socket.id);
            }
        });

    });
};

module.exports = socketHandler;
