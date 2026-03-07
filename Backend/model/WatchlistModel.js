import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

WatchlistSchema.index({ user: 1, symbol: 1 }, { unique: true });

const WatchlistModel = mongoose.model("Watchlist", WatchlistSchema);

export default WatchlistModel;
