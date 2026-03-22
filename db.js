const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    console.log("MONGO_URI exists:", !!uri);

    if (!uri) {
      throw new Error("MONGO_URI is not defined");
    }

    mongoose.set("strictQuery", false);
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

module.exports = connectDB;