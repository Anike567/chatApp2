const MAX_INTERVAL_MS = parseInt(process.env.MAX_INTERVAL_MS);
const { getChannel } = require('../config/rabbitMq');
const saveOfflineMessage = require('./saveMessageForOfflineUser');
const queue = 'task_queue'

const messageScheduler = () => {


    setInterval(async () => {
        const newBatch = [];
        try {
            getChannel().consume(queue,(msg)=>{
                if(msg != null){
                    newBatch.push((JSON.parse(msg.content)));
                    console.log(newBatch);
                    getChannel().ack(msg);
                }else{
                    console.log(newBatch);
                    saveOfflineMessage(newBatch);
                }
            })
        } catch (error) {
            console.error("Error processing message batch:", error);
        }
    }, MAX_INTERVAL_MS)
}

module.exports = {messageScheduler}