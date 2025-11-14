const saveOfflineMessage = require('../utility/saveMessageForOfflineUser');
const { master } = require('../config/redis');
const { uuidToBase64UrlSafe, base64UrlSafeToUuid } = require('../utility/base64Encoding');
const { AppDataSource } = require('./../config/data-source');
const sendAndSaveMessages = async (data, cb, authNamespace) => {

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

        return;

    } catch (error) {
        console.log(error);
        cb({ error: true, message: "Internal Server error try again later" });
        return;
    }

}

const getMessages = async (data, callback) => {
    try {
        const messageRepository = AppDataSource.getRepository("OfflineMessage");
        const { from, to } = data.data;

        const savedMessages = await messageRepository.query(
            `
            SELECT * FROM (
                SELECT * FROM messages
                WHERE (\`from\` = ? AND \`to\` = ?)
                   OR (\`from\` = ? AND \`to\` = ?)
                ORDER BY created_at DESC
                LIMIT 50
            ) AS recent_messages
            ORDER BY created_at ASC;
            `,
            [from, to, to, from]
        );
        
        callback({ error: false, savedMessages });
    } catch (err) {
        console.error(err);
        callback({
            error: true,
            message: "Something went wrong, please try again later",
        });
    }
};

module.exports = { sendAndSaveMessages, getMessages }