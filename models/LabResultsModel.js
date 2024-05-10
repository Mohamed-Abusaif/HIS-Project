const mongoose = require("mongoose");
const validator = require("validator");

const labResultsSchema = new mongoose.Schema({
  testResults: {
    //will be an image
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  labType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LabType",
  },
});

const LabResults = mongoose.model("LabResults", labResultsSchema);
module.exports = LabResults;
