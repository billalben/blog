import mongoose, { type ConnectOptions } from "mongoose";
import config from "@/config";

const clientOptions: ConnectOptions = {
  dbName: "blog-db",
  appName: "BlogApp",
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    console.log("Connected to database successfully", {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error; // Rethrow the error to be handled by the caller
    }

    console.error("Error connecting to MongoDB:", error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    if (error instanceof Error) {
      throw error; // Rethrow the error to be handled by the caller
    }

    console.error("Error disconnecting from MongoDB:", error);
  }
};
