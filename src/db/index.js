import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore DNS setServers error if restricted
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/projmanage";
  try {
    const connectionInstance = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected! Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("❌ Primary MongoDB connection failed:", error.message);
    if (uri !== "mongodb://127.0.0.1:27017/projmanage") {
      console.log("🔄 Attempting fallback connection to local MongoDB (mongodb://127.0.0.1:27017/projmanage)...");
      try {
        const localInstance = await mongoose.connect("mongodb://127.0.0.1:27017/projmanage");
        console.log(`✅ Connected to local MongoDB! Host: ${localInstance.connection.host}`);
        return;
      } catch (localError) {
        console.log("❌ Local MongoDB fallback failed:", localError.message);
      }
    }
    console.log("\n💡 MongoDB Connection Troubleshooting:");
    console.log(" 1. Check your .env MONGO_URI string.");
    console.log(" 2. Ensure your current IP is allowed in MongoDB Atlas (Network Access -> 0.0.0.0/0).");
    console.log(" 3. Or start local MongoDB service on port 27017.\n");
    process.exit(1);
  }
};

export default connectDB;
