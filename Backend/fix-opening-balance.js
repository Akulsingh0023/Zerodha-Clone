import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./model/User.js";

dotenv.config();

const run = async () => {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    console.error("MONGO_URL is not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("DB connected");

    const users = await User.find({});
    let updatedCount = 0;

    for (const user of users) {
      user.openingBalance = Number(user.walletBalance || 0);
      await user.save();
      updatedCount += 1;
    }

    console.log(`Opening balance synced for ${updatedCount} users`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to sync openingBalance:", error.message);
    process.exit(1);
  }
};

run();
