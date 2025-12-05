const { connectToRabbitQueue, getChannel } = require('./../config/rabbitMq');
const saveOfflineMessage = require('./saveMessageForOfflineUser');
const { AppDataSource } = require('./../config/data-source');



const queue = 'task_queue';
let buffer = [];

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to database successfully");
    startWorker();
  })
  .catch((err) => {
    console.log("DB error:", err);
  });

async function startWorker() {
    await connectToRabbitQueue();

    const channel = getChannel();
    if (!channel) {
        console.error("❌ RabbitMQ channel not initialized!");
        process.exit(1);
    }

    await channel.assertQueue(queue, { durable: true });

    const FLUSH_INTERVAL = 100;

    setInterval(async () => {
        if (buffer.length > 0) {
            const batch = buffer;
            buffer = [];
            try {
                await saveOfflineMessage(batch);
            } catch (err) {
                console.error("Batch save failed:", err);
            }
        }
    }, FLUSH_INTERVAL);

    channel.consume(queue, async (msg) => {
        try {
            const data = JSON.parse(msg.content.toString());
            buffer.push(data);
        } catch (err) {
            console.error("Error parsing message:", err);
        }

        channel.ack(msg);
    });

    console.log("Worker is running and consuming messages...");
}
