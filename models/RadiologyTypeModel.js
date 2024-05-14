const mongoose = require("mongoose");
const validator = require("validator");

const radiologyTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Radiology Type Name!"],
  },
  availability: {
    type: String,
    required: [true, "Please Provide Availability of The Radiology Test!"],
    enum: ["Available", "Not Available"],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "Please Provide Radiology Test Price!"],
  },
});

const RadType = mongoose.model("RadType", radiologyTypeSchema);
module.exports = RadType;
