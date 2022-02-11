const Bot = require('./Structures/Bot');
const config = require('../config.json');

const client = new Bot(config);
client.start();