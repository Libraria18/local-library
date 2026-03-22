const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://library_user:test1234@cluster0.pi2zj8n.mongodb.net/?appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;