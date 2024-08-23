const express = require("express");

const appointmentsController = require("./controllers/appointmentsController");

const router = express.Router();

// API endpoint to create an appointment
router.post("/appointments", appointmentsController.createAppointment );
router.post("/surgeryAppointments", appointmentsController.createSurgeryAppointment);

module.exports = router;
