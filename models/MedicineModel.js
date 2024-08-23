const mongoose = require("mongoose");
const validator = require("validator");

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Medicine Name!"],
  },
  quantity: {
    type: Number,
    required: [true, "Please Provide Medicine Quantity!"],
  },
  price: { type: Number, required: [true, "Please Provide Medicine Price!"] },
  description: {
    type: String,
    required: [true, "Please Provide Medicine Description!"],
  },
  pharmacies: {
    type: String,
    default: "Pharmacy 1",
  },
});

const Medicine = mongoose.model("Medicine", medicineSchema);
module.exports = Medicine;
