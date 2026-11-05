require("dotenv").config();

const dns = require("node:dns");

// Use public DNS servers
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
});

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");

    await client.connect();

    await client.db("admin").command({ ping: 1 });

    console.log("MongoDB connection successful!");
  } catch (error) {
    console.error("Connection error:", error);
  } finally {
    await client.close();
  }
}

testConnection();
