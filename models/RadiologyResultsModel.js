const mongoose = require("mongoose");
const validator = require("validator");

const RadResultsSchema = new mongoose.Schema({
  testResults: {
    //will be an image or a pdf file
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  radType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RadType",
  },
});

const RadResults = mongoose.model("RadResults", RadResultsSchema);
module.exports = RadResults;
