const getUserHandler = require('./getUserHandler');
const loginHandler = require('./login');
const signupHandler = require('./signup');
const searchHandler = require("./searchhHandler");
const saveOfflineMessage = require('./../utility/saveMessageForOfflineUser');
const { master } = require('./../config/redis');
const uploadFile = require('./fileHandler');
const { findUsername, verifyOtp } = require('./forgetPassword');
const { addFriend, findFriendRequest, acceptFriendRequest } = require('./friends');
const { logDetails } = require('../utility/logger');
const { AppDataSource } = require('./../config/data-source');
const uuidToBase64UrlSafe = require('./../utility/base64Encoding');
const verifyToken = require('../utility/verifyToken');





const socketHandler = (io) => {
    io.of("/app").on('connection', (socket) => {
        // logDetails(socket);

        socket.on('updateSocketId', (data) => {
            let { userId, socketid } = data;
            userId = uuidToBase64UrlSafe(userId);
            master.set(userId, socketid);
            master.set(socket.id, userId);

        });



        socket.on('getMessages', async (data, callback) => {
            const token = data.token;
            const verifiedToken = verifyToken(token);

            if (verifiedToken) {
                const messageRepository = AppDataSource.getRepository("OfflineMessage");
                const { from, to } = data.data;
                const savedMessages = await messageRepository.query(
                    `
                SELECT * FROM offline_message WHERE (\`from\` = ? AND \`to\` = ?) OR (\`from\` = ? AND \`to\` = ?) order by created_at asc`,
                    [from, to, to, from]
                );
                callback({error : false, savedMessages});
            }

            else{
                callback({error : true, message : "Invalid or Expired token please login again"});
            }


        });


        socket.on('message-received', async (data, cb) => {
            console.log(socket.data.token);
            const token = data.token;
            const verifiedToken = verifyToken(token);
            if (verifiedToken) {
                try {

                    data = data.msg;
                    saveOfflineMessage(data);
                    const socketId = await master.get(uuidToBase64UrlSafe(data.to));
                    if (socketId) {
                        cb({ error: false, status: true });
                        io.to(socketId).emit('message-received', data);
                    } else {
                        cb({ error: false, status: false });
                    }


                } catch (error) {
                    cb({ error: true, message: "Internal Server error try again later" });
                }
            }
            else {
                cb({ error: true, message: "Token missing please login again" });
            }
        });


        //login event handler
        



        //forget Password section

        socket.on('findUsername', (data, cb) => { findUsername(data, cb) });

        socket.on('verify-otp', (data, cb) => { verifyOtp(data, cb) });
        // signup event handler 

        socket.on('signupEvent', (data) => { signupHandler(data, socket) });

        /**
         * @description this will fetch all the users from database
         
         * @returns {[Users]}
         */

        socket.on('getuser', async (data, callback) => {
            try {

                const users = await getUserHandler(data);
                if (!users) {
                    callback({ error: true, message: "Missing token please login again" })
                }
                callback({ error: false, message: { users } });
            } catch (err) {
                console.error(err);
                callback({ error: true, message: "Internal server error occured try again later" });
            }
        });



        // search for username 

        socket.on("search", (data, cb) => {
            searchHandler(data, cb);
        });

        // update profile picture

        socket.on("file-upload", (data, cb) => {
            uploadFile(data, cb);
        })

        //add friend 

        socket.on("addFriend", (data, cb) => {
            addFriend(data, cb);
        });


        //find friendRequest

        socket.on("getFriendRequestList", (data, cb) => {
            findFriendRequest(data, cb);
        })

        socket.on("accept-request", (data, cb) => {
            acceptFriendRequest(data, cb);
        })

        /**
         * @description handle cleanup 
         * @returns {void}
         * @parama {null}
         */
        socket.on('disconnect', async () => {

            const userId = await master.get(socket.id);
            if (userId) {
                await master.del(userId);
                await master.del(socket.id);

            }
        });

    });
};

module.exports = socketHandler;
