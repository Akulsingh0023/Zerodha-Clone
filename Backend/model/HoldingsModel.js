import mongoose from "mongoose";

const HoldingsSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const HoldingsModel = mongoose.model("Holding", HoldingsSchema);

export default HoldingsModel;
