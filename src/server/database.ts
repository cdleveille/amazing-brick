import mongoose from "mongoose";

import { Config } from "@/server/config";

export const connectToDatabase = async () => {
  console.log(`Connecting to database on ${Config.MONGO_URI}...`);
  await mongoose.connect(Config.MONGO_URI);
  console.log("Connected to database successfully.");
};
