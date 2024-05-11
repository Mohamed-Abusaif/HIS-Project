const mongoose = require("mongoose");
const validator = require("validator");

const pharmacySchema = new mongoose.Schema({
  pharmacyNumber: {
    type: String,
  },
  floor: {
    type: String,
  },
  description: {
    type: String,
  },
  // medicines: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Medicine",
  //   },
  // ],
});

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
module.exports = Pharmacy;
