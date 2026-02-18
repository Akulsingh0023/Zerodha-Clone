const {model, default: mongoose} = require("mongoose")

const {PositionsSchema} = require("../schemas/PositionsSchema");

const PositionsModel = new model("position",PositionsSchema);

module.exports = {PositionsModel};