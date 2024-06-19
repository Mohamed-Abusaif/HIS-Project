const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Surgery Appointment schema
const surgeryAppointmentSchema = new Schema({
  patientName: {
    type: String,
    required: true,
  },
  clinicName: {
    type: String,
    required: true,
  },
  surgeryType: {
    type: String,
    required: true,
    enum: [
      "Cardiac Surgery",
      "Neurosurgery",
      "Orthopedic Surgery",
      "Plastic Surgery",
      "General Surgery",
      "Pediatric Surgery",
      "Thoracic Surgery",
      "Vascular Surgery",
      "Urologic Surgery",
      "Ophthalmic Surgery",
      "ENT Surgery",
      "Gynecologic Surgery",
      "Dental Surgery",
      "Gastrointestinal Surgery",
    ],
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
  surgeonName: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
});

// Create the Surgery Appointment model
const SurgeryAppointment = mongoose.model(
  "SurgeryAppointment",
  surgeryAppointmentSchema
);

module.exports = SurgeryAppointment;
