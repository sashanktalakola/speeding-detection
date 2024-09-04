require('dotenv').config();
const { Kafka } = require('kafkajs');
const { processNotification } = require('./notificationHandler');

const brokerHost = process.env.KAFKA_BROKER;
const brokerPort = process.env.KAFKA_PORT;
const brokerAddress = `${brokerHost}:${brokerPort}`;

const kafka = new Kafka({
    clientId: 'notification-service',
    brokers: [brokerAddress],
});


const consumer = kafka.consumer({ groupId: 'notification-group' });

const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'notifications', fromBeginning: true });
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const notification = JSON.parse(message.value.toString());
          console.log(`Received message: ${JSON.stringify(notification)}`);
  
          // Process the notification using notificationHandler
          await processNotification(notification);
        } catch (err) {
          console.error('Error processing message:', err);
        }
      },
  });
};

runConsumer().catch(console.error);