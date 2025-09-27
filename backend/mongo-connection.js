require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);

async function connectMongo() {
  if (!client.isConnected) {
    await client.connect();
  }
  return client.db(process.env.MONGO_DB);
}

module.exports = connectMongo;
