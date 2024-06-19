const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Appointment schema
const appointmentSchema = new Schema({
  patientName: {
    type: String,
    required: true,
  },
  clinicName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

// Create the Appointment model
const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
