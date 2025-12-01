const { commitProcessedMessages } = require('../config/rabbitConsumer');
const { AppDataSource } = require('./../config/data-source');


const saveOfflineMessage = async (messages) => {
    try {
        const messageRepository = AppDataSource.getRepository("OfflineMessage");

        const newMessages = messages.map(msg => ({
            to_user: msg.to,
            from_user: msg.from,
            delivered: msg.delivered ?? null,
            message: msg.message,
        }));

        console.log("Saving messages:", newMessages);
        const savedMessages = await messageRepository.save(newMessages);
        if(savedMessages){
            commitProcessedMessages();
        }
        return savedMessages;
    } catch (err) {
        console.error("Error saving offline messages:", err);
        throw err;
    }
};

module.exports = saveOfflineMessage;
