const mongoose = require("mongoose");
const validator = require("validator");

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  quantity: Number,
  price: Number,
  description: {
    type: String,
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
  },
});

const Medicine = mongoose.model("Medicine", medicineSchema);
module.exports = Medicine;
