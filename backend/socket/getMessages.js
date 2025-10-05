const saveOfflineMessage = require('./../utility/saveMessageForOfflineUser');
const { master } = require('./../config/redis');
const {uuidToBase64UrlSafe, base64UrlSafeToUuid} = require('./../utility/base64Encoding');

const sendAndSaveMessages =async (data, cb, authNamespace) => {

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

}

module.exports = sendAndSaveMessages