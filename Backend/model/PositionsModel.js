import mongoose from "mongoose";

const PositionsSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
  product: {
    type: String,
    enum: ["MIS"],
    default: "MIS",
  },
  productType: {
    type: String,
    enum: ["MIS"],
    default: "MIS",
  },
  status: {
    type: String,
    enum: ["OPEN", "CLOSED"],
    default: "OPEN",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const PositionsModel = mongoose.model("Position", PositionsSchema);

export default PositionsModel;
