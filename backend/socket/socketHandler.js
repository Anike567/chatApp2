const getUserHandler = require('./getUserHandler');
const searchHandler = require("./searchhHandler");
const uploadFile = require('./fileHandler');
const { findUsername, verifyOtp } = require('./forgetPassword');
const { addFriend, findFriendRequest, acceptFriendRequest } = require('./friends');
const { logDetails } = require('../utility/logger');

const onDisconnect = require('./onDisconnect');
const authMiddleware = require('./../middleware/auth.middleware');
const updateSocketId = require('./updateSocketId');
const heartbeat = require('./hearbeat');
const {sendAndSaveMessages, getMessages} = require('./messages');
const {subClient} = require ('./../config/redis');





const socketHandler = (io) => {

    const authNamespace = io.of("/app");


    authNamespace.use((socket, next) => { authMiddleware(socket, next) });

    subClient.on("message", async(channel, msg)=>{
        const message = JSON.parse(msg);
        const {socketId, payload} = message;
        if(authNamespace.sockets.has(socketId)){
            authNamespace.to(socketId).emit("message-received", payload);
        }
    })

    authNamespace.on('connection', (socket) => {
        // logDetails(socket);

        console.log(`${socket.id } is connected on server running on 4000`);

        socket.on('updateSocketId', (data, cb) => {
            updateSocketId(data, cb);
        });



        socket.on('getMessages', async (data, callback) => {
            getMessages(data, callback);
        });


        socket.on('message-received', (data, cb) => {

           sendAndSaveMessages(data, cb, authNamespace);

        });


        //login event handler




        //forget Password section

        socket.on('findUsername', (data, cb) => { findUsername(data, cb) });

        socket.on('verify-otp', (data, cb) => { verifyOtp(data, cb) });
        // signup event handler 

        

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
