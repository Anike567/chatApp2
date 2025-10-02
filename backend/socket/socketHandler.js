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
const onDisconnect = require('./onDisconnect');
const {uuidToBase64UrlSafe} = require('./../utility/base64Encoding');
const authMiddleware = require('./../middleware/auth.middleware');
const updateSocketId = require('./updateSocketId');
const heartbeat = require('./hearbeat');





const socketHandler = (io) => {

    const authNamespace = io.of("/app");


    authNamespace.use((socket, next) => { authMiddleware(socket, next) });

    authNamespace.on('connection', (socket) => {
        // logDetails(socket);

        socket.on('updateSocketId', (data) => {
            updateSocketId(data);

        });



        socket.on('getMessages', async (data, callback) => {


            const messageRepository = AppDataSource.getRepository("OfflineMessage");
            const { from, to } = data.data;
            const savedMessages = await messageRepository.query(
                `
                SELECT * FROM offline_message WHERE (\`from\` = ? AND \`to\` = ?) OR (\`from\` = ? AND \`to\` = ?) order by created_at asc`,
                [from, to, to, from]
            );
            callback({ error: false, savedMessages });


        });


        socket.on('message-received', async (data, cb) => {

            try {

                data = data.msg;
                saveOfflineMessage(data);
                const socketId = await master.get(uuidToBase64UrlSafe(data.to));

                if (socketId) {
                    authNamespace.to(socketId).emit('message-received', data);
                    cb({ error: false, status: true });

                } else {
                    cb({ error: false, status: false });
                }


            } catch (error) {
                console.log(error);
                cb({ error: true, message: "Internal Server error try again later" });
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


        //get selected user status heartbear

        socket.on('heartbeat',(data, cb)=>{
            heartbeat(data, cb);
        })

        /**
         * @description handle cleanup 
         * @returns {void}
         * @parama {null}
         */
        socket.on('disconnect', async () => {
            onDisconnect(socket);
            
        });

    });
};

module.exports = socketHandler;
