const { AppDataSource } = require('./../config/data-source');

const saveOfflineMessage = async (msg) => {
    try {
        const messageRepository = AppDataSource.getRepository("OfflineMessage");

        // Map payload array to entity objects
        const newMessages ={
            to_user: msg.to,
            from_user: msg.from,
            delivered: msg.delivered ?? null,
            message: msg.message,
        };

        // Save all at once (TypeORM supports array save)
        const savedMessages = await messageRepository.save(newMessages);

        return savedMessages;
    } catch (err) {
        console.error("Error saving offline messages:", err);
        throw err;
    }
};

module.exports = saveOfflineMessage;
