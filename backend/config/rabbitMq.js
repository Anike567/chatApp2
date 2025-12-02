const amqp = require('amqplib');

let channel;
let connection; // store connection globally
let queue;

async function connectToRabbitQueue() {
    connection = await amqp.connect('amqp://localhost'); // store connection
    channel = await connection.createChannel();

    queue = 'task_queue';
    await channel.assertQueue(queue, { durable: true });
    console.log("RabbitMQ connected and queue asserted:", queue);
}

async function rabbitQueueCleanup() {
    if (channel) {
        await channel.close();
        console.log("Channel closed");
    }
    if (connection) {
        await connection.close();
        console.log("Connection closed");
    }
}

module.exports = {
    connectToRabbitQueue,
    rabbitQueueCleanup,
    getChannel: () => channel,
};
