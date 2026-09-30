const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in the environment variables.");
    }
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error; // Re-throw the error to handle it in the app.js file
  }
};

module.exports = dbConnection;