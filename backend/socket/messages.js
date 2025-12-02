
const { master } = require('../config/redis');
const { uuidToBase64UrlSafe, base64UrlSafeToUuid } = require('../utility/base64Encoding');
const { AppDataSource } = require('./../config/data-source');
const { pubClient } = require('./../config/redis');
const { getPublisher, getChannel } = require('../config/rabbitMq');
const SERVER_ID = process.env.SERVER_ID;
const queue = 'task_queue'

const sendAndSaveMessages = async (data, cb, authNamespace) => {

    try {

        data = data.msg;
        await getChannel().sendToQueue(queue, Buffer.from(JSON.stringify(data), { persistent: true }))
        const socketId = await master.get(uuidToBase64UrlSafe(data.to));
        if (!socketId) {
            cb({ error: false, status: false });
            return;
        }

        if (socketId) {
            if (authNamespace.sockets.has(socketId)) {
                authNamespace.to(socketId).emit('message-received', data);

            }
            else {
                pubClient.publish("global_channel", JSON.stringify({
                    serverId: SERVER_ID,
                    'socketId': socketId,
                    payload: data
                }));
            }
            cb({ error: false, status: true });
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

const deleteMessage = async (data, cb) => {
    const messageRepository = AppDataSource.getRepository("OfflineMessage");
    const { msgId } = data;

    try {
        const result = await messageRepository.delete({ _id: msgId });

        if (result.affected === 0) {
            return cb({
                error: true,
                status: 404,
                message: "Message not found",
            });
        }

        cb({
            error: false,
            status: 200,
            message: "Message deleted successfully",
        });

    } catch (err) {
        console.log("Delete error:", err);

        cb({
            error: true,
            status: 500,
            message: "Something went wrong, please try again later",
        });
    }
};

const editMessage = async (data, cb) => {
    const { msgId, msg } = data;
    const messageRepository = AppDataSource.getRepository("OfflineMessage");
    try {
        const result = await messageRepository.update(
            { _id: msgId },
            { message: msg }
        );

        if (result.affected === 0) {
            return cb({
                error: true,
                status: 404,
                message: "Message not found",
            });
        }
        cb({
            error: false,
            status: 200,
            message: "Message deleted successfully",
        });

    } catch (error) {
        console.error(err);
        callback({
            error: true,
            message: "Something went wrong, please try again later",
        });
    }
};


module.exports = { sendAndSaveMessages, getMessages, deleteMessage, editMessage}