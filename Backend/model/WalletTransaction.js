import mongoose from "mongoose";

const WalletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      enum: ["stock_buy", "stock_sell", "manual_add", "withdraw"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

const WalletTransaction = mongoose.model("WalletTransaction", WalletTransactionSchema);

export default WalletTransaction;
