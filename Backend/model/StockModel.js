import mongoose from "mongoose";

const StockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    change: {
      type: Number,
      default: 0,
    },
    changePercent: {
      type: Number,
      default: 0,
    },
    marketCap: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const StockModel = mongoose.model("Stock", StockSchema);

export default StockModel;
