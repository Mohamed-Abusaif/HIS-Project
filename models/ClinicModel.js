const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the clinic name!"],
  },
  location: {
    type: String,
    required: [true, "Please provide the clinic location!"],
  },
  contactNumber: {
    type: String,
    required: [true, "Please provide the clinic contact number!"],
  },
});

const Clinic = mongoose.model("Clinic", clinicSchema);

module.exports = Clinic;
