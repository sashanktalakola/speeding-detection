const runConsumer = require('./kafkaConsumer');
const { processNotification } = require('./notificationHandler');
require('dotenv').config();


runConsumer(processNotification).catch(console.error);