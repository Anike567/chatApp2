
const rabbit = require('rabbitmq-stream-js-client');
let consumer = null;
const streamName = "sent-messages";
let messageBuffer = [];
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE);
let lastProcessedOffset = null;

async function connectConsumer() {
    client = await rabbit.connect({
        hostname: "localhost",
        port: 5552,
        username: "guest",
        password: "guest",
        vhost: "/"
    });

    consumer = await client.declareConsumer({ stream: streamName, offset: rabbit.Offset.first() }, (message) => {
        messageBuffer.push({
            content: JSON.parse(message.content.toString()),
            offset: message.offset
        });
    })
}


function getMessageBatch() {
    if (messageBuffer.length < BATCH_SIZE) {
        return []
    }
    const batch = [...messageBuffer];
    messageBuffer = [];
    if(batch.length > 0){
        lastProcessedOffset = batch[batch.length-1].offset;
    }
    return batch.map((msg)=>(msg.content));
}

function getMessages() {
    const messages = [...messageBuffer];
    return messages
}

async function commitProcessedMessages() {
    if(consumer && lastProcessedOffset !== null) {
        await consumer.storeOffset(lastProcessedOffset);
    }
}
module.exports = {
    connectConsumer,
    getMessageBatch,
    getMessages,
    commitProcessedMessages
};
