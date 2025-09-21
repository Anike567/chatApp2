const { AppDataSource } = require('./../config/data-source');

const saveOfflineMessage = async (payload) => {
    try {
        const messageRepository = AppDataSource.getRepository("OfflineMessage");

        const newMessage = {
            to_user: payload.to,
            from_user: payload.from,
            delivered: payload.delivered ?? null,
            message: payload.message,
        };

        const savedMessage = await messageRepository.save(newMessage);
        return savedMessage;
    } catch (err) {
        console.error("Error saving offline message:", err);
        throw err;
    }
};

module.exports = saveOfflineMessage;