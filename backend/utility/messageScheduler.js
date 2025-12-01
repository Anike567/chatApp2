const MAX_INTERVAL_MS = parseInt(process.env.MAX_INTERVAL_MS);
const {
    getMessageBatch,
} = require('./../config/rabbitConsumer');
const saveOfflineMessage = require('./saveMessageForOfflineUser');

const messageScheduler = () => {


    setInterval(async () => {
        try {
            const messages = getMessageBatch();
            if(messages.length > 0){
                // console.log(await saveOfflineMessage(messages));
                console.log(messages);
            }
        } catch (error) {
            console.error("Error processing message batch:", error);
        }
    }, MAX_INTERVAL_MS)
}

module.exports = {messageScheduler}