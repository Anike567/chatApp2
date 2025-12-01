const rabbit = require('rabbitmq-stream-js-client');

let rabbitmqClient;
let publisher;

const connectToRabbitMqServer = async () => {
    rabbitmqClient = await rabbit.connect({
        hostname: "localhost",
        port: 5552,
        username: "guest",
        password: "guest",
        vhost: "/",
    });

    return rabbitmqClient;
};

const initRabbitPublisher = async () => {
    if (!rabbitmqClient) throw new Error("RabbitMQ not connected!");

    publisher = await rabbitmqClient.declarePublisher({
        stream: "sent-messages",
    });

    console.log("RabbitMQ publisher created");
};



module.exports = {
    connectToRabbitMqServer,
    initRabbitPublisher,
    getPublisher: () => publisher,
};
