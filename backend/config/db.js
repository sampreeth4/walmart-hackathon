// backend/config/db.js
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()


const connectDB = async () => {
    console.log("Mongo URI is:", process.env.MONGODB_URI)
    try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    process.exit(1) // Exit with failure
  }
}

export default connectDB
