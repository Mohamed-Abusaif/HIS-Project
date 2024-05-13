const mongoose = require("mongoose");
const validator = require("validator");

const labTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Lab Type Name!"],
  },
  Availability: {
    type: String,
    required: [true, "Please Provide Availability of The Lab Test!"],
    enum: ["Available", "Not Available"],
  },
  description: {
    type: String,
  },
  price: { type: Number, required: [true, "Please Provide Lab Test Price!"] },
});

const LabType = mongoose.model("LabType", labTypeSchema);
module.exports = LabType;
