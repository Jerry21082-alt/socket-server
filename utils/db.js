require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const { MongoClient } = require("mongodb");

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables!");
}

const client = new MongoClient(process.env.MONGO_URI);
let cachedClient = null;

async function connectToDatabase() {
  if (!cachedClient) {
    cachedClient = await client.connect();
  }

  const db = cachedClient.db("pinch");
  return { db };
}

module.exports = { connectToDatabase };
