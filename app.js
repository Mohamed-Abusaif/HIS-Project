const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const cors = require("cors");

const receptionistRouter = require("./routes/receptionistRoutes");
const adminRouter = require("./routes/AdminRoutes/adminRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const patientRouter = require("./routes/patientRoutes");
const clinicModel = require("./models/ClinicModel");
const authRouter = require("./routes/authRoutes");
const catchAsync = require("./utils/catchAsync");
const PatientUser = require("./models/PatientModel");
const Surgery = require("./models/Surgery");
const DoctorUser = require("./models/DoctorModel");
const Appointment = require("./models/Appointment"); // Adjust the path as needed
const generateMRN = require("./utils/generateMRN");
const { isSlotAvailable } = require("./utils/isTimeAvailableFunction"); // Import the utility function

const mongoose = require("mongoose");
const app = express();

// 1) MiddleWares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cors());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
// Function to find an available doctor
// API endpoint to create a surgery appointment

// Mapping of surgery types to doctor specializations
const surgeryTypeToSpecialization = {
  "Cardiac Surgery": "Cardiology",
  "Orthopedic Surgery": "Orthopedics",
  "Plastic Surgery": "Plastic Surgery",
  "General Surgery": "General Surgery",
  "Pediatric Surgery": "Pediatrics",
  "Thoracic Surgery": "Thoracic Surgery",
  "Vascular Surgery": "Vascular Surgery",
  "Urologic Surgery": "Urology",
  "Ophthalmic Surgery": "Ophthalmology",
  "ENT Surgery": "ENT",
  "Gynecologic Surgery": "Gynecology",
  "Dental Surgery": "Dentistry",
  "Gastrointestinal Surgery": "Gastroenterology",
};
// Function to find a random doctor based on specialization
const findRandomDoctor = async (specialization) => {
  const doctors = await DoctorUser.find({ specialization: specialization });
  if (doctors.length > 0) {
    const randomIndex = Math.floor(Math.random() * doctors.length);
    return doctors[randomIndex];
  }
  return null;
};
app.post("/surgeryAppointments", async (req, res) => {
  const { patientName, clinicName, surgeryType, date, time, reason, notes } =
    req.body;

  // Check if the slot is available
  if (await isSlotAvailable(Surgery, clinicName, date, time)) {
    // Get the specialization based on the surgery type
    const specialization = surgeryTypeToSpecialization[surgeryType];

    // Find a random doctor with the appropriate specialization
    const randomDoctor = await findRandomDoctor(specialization);

    if (randomDoctor) {
      // Create a new surgery appointment
      const newSurgeryAppointment = new Surgery({
        patientName,
        clinicName,
        surgeryType,
        date,
        time,
        reason,
        surgeonName: randomDoctor.name,
        notes,
      });

      try {
        await newSurgeryAppointment.save();
        res.status(201).json({
          message: "Surgery appointment created successfully",
          appointment: newSurgeryAppointment,
          userMessage: `Your surgery appointment is confirmed with Dr. ${randomDoctor.name}.`,
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error creating surgery appointment", error });
      }
    } else {
      res
        .status(400)
        .json({ message: "No doctors available in the chosen department" });
    }
  } else {
    res.status(400).json({ message: "The chosen time slot is not available" });
  }
});
// API endpoint to create an appointment
app.post("/appointments", async (req, res) => {
  const { patientName, clinicName, date, time, reason } = req.body;

  // Check if the slot is available
  if (await isSlotAvailable(Appointment, clinicName, date, time)) {
    // Create a new appointment
    const newAppointment = new Appointment({
      patientName,
      clinicName,
      date,
      time,
      reason,
    });

    try {
      await newAppointment.save();
      res
        .status(201)
        .json({
          message: "Appointment created successfully",
          appointment: newAppointment,
        });
    } catch (error) {
      res.status(500).json({ message: "Error creating appointment", error });
    }
  } else {
    res.status(400).json({ message: "The chosen time slot is not available" });
  }
});
// 2) Routes
app.use("/", receptionistRouter);
app.use("/admin", adminRouter);
app.use("/", patientRouter);
app.use("/", doctorRouter);
app.use("/", authRouter);

module.exports = app;
