
const getUserHandler = require('./getUserHandler');
const loginHandler = require('./login');
const signupHandler = require('./signup');
const connectionPool = require('./../config/connection');
const searchHandler = require("./searchhHandler");
const saveOfflineMessage = require('./../utility/saveMessageForOfflineUser');
const { master, getReplica } = require('./../config/redis');
const uploadFile = require('./fileHandler');
const {findUsername, verifyOtp} = require('./forgetPassword');
const {addFriend, findFriendRequest} = require('./addFriend');

const socketHandler = (io) => {
    io.on('connection', (socket) => {

        socket.on('updateSocketId', (data) => {
            const { userId, socketid } = data;

            master.set(userId, socketid);
            master.set(socket.id, userId);

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


        socket.on('message-received', async (data, cb) => {
            try {
                const socketId = await getReplica().get(data.to);
                if (socketId) {
                    cb(true);
                    io.to(socketId).emit('message-received', data);
                } else {
                    cb(false);

                    saveOfflineMessage(data);
                }
            } catch (error) {
                console.error('Redis error:', error);
            }
        });


        //login event handler
        socket.on('loginEvent', (user, callback) => {

            loginHandler(user, socket, callback);
        });



        //forget Password section

        socket.on('findUsername',(data, cb)=>{findUsername(data, cb)});

        socket.on('verify-otp',(data, cb)=>{verifyOtp(data, cb)});
        // signup event handler 

        socket.on('signupEvent', (data) => { signupHandler(data, socket) });

        /**
         * @description this will fetch all the users from database
         
         * @returns {[Users]}
         */

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

        // search for username 

        socket.on("search", (data, cb) => {
            searchHandler(data, cb);
        });

        // update profile picture

        socket.on("file-upload",(data, cb)=>{
            uploadFile(data, cb);
        })

        //add friend 

        socket.on("addFriend",(data,cb)=>{
            addFriend(data, cb);
        });


        //find friendRequest

        socket.on("getFriendRequestList",(data,cb)=>{
            findFriendRequest(data, cb);
        })

        /**
         * @description handle cleanup 
         * @returns {void}
         * @parama {null}
         */
        socket.on('disconnect', async () => {

            const userId = await getReplica().get(socket.id);
            if (userId) {
                await master.del(userId);
                await master.del(socket.id);

            }
        });

    });
};

module.exports = socketHandler;
