const mongoose = require("mongoose");
const validator = require("validator");

const radiologyTypeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  availability: {
    type: String,
    enum: ["Available", "Not Available"],
  },
  description: {
    type: String,
  },
  price: Number,
});

const RadType = mongoose.model("RadType", radiologyTypeSchema);
module.exports = RadType;
