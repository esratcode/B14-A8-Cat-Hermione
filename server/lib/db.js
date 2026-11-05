const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db(process.env.DB_NAME);

module.exports = { client, db };
