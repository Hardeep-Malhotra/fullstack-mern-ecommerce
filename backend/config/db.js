import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const data = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `🟢 MongoDB connected with server ${data.connection.host}`
    );
  } catch (error) {
    console.error(
      `🔴 MongoDB Connection Error: ${error.message}`
    );

    throw error;
  }
};