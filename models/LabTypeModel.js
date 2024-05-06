const mongoose = require("mongoose");
const validator = require("validator");

const labTypeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  Availability: {
    type: String,
    enum: ["Available", "Not Available"],
  },
  description: {
    type: String,
  },
  price: Number,
});

const LabType = mongoose.model("LabType", labTypeSchema);
module.exports = LabType;
