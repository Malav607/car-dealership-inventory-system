const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("\n========== ATLAS CONNECTION ERROR ==========");
    console.error(error);
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Cause:", error.cause);
    console.error("Stack:\n", error.stack);
    console.error("============================================\n");

    try {
      console.log(
        "🔄 Trying local MongoDB instance (mongodb://127.0.0.1:27017/car-dealership)..."
      );

      await mongoose.connect("mongodb://127.0.0.1:27017/car-dealership", {
        serverSelectionTimeoutMS: 3000,
      });

      console.log("✅ Connected to Local MongoDB Successfully");
    } catch (localErr) {
      console.error(localErr);
    }
  }
};

module.exports = connectDB;