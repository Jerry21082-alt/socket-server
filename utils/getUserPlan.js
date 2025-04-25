const { connectToDatabase } = require("../utils/db");

async function getUserPlan(userId) {
  const { db } = await connectToDatabase();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new Error("User not found in DB");
  }
  return user.plan || "basic";
}

module.exports = { getUserPlan };
