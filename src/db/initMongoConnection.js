import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const DB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/?retryWrites=true&w=majority`;

export const initDBConnection = async () => {
  try {
    console.log("Connecting to MongoDB with URL:", DB_URI);
    await mongoose.connect(DB_URI);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};
