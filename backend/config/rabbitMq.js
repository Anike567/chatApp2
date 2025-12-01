const rabbit = require('rabbitmq-stream-js-client');


const connectToRabbitMqServer = async () => {
    const client = await rabbit.connect(
        {
            hostname: "localhost",
            port: 5552,
            username: "guest",
            password: "guest",
            vhost: "/",

        })
    return client;
}

module.exports = {connectToRabbitMqServer};