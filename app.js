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
const generateMRN = require("./utils/generateMRN");
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

// 2) Routes
app.post("/createClinic", (req, res, next) => {
  clinicModel.create(req.body);
  res.json({
    msg: "done!",
  });
});

function getRandomMedicine(medicines) {
  // Check if medicines array is provided
  if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
    throw new Error("Please provide a valid array of medicines");
  }

  // Get a random index within the medicines array
  const randomIndex = Math.floor(Math.random() * medicines.length);

  // Return the medicine name at the random index
  return medicines[randomIndex];
}
const medicines = [
  "Paracetamol",
  "Ibuprofen",
  "Aspirin",
  "Amoxicillin",
  "Azithromycin",
  "Cephalexin",
  "Ciprofloxacin",
  "Clarithromycin",
  "Clindamycin",
  "Doxycycline",
  "Erythromycin",
  "Levofloxacin",
  "Metronidazole",
  "Nitrofurantoin",
  "Penicillin",
  "Sulfamethoxazole",
  "Tetracycline",
  "Trimethoprim",
  "Vancomycin",
  "Zithromax",
];
app.post(
  "/createPatientUsers",
  catchAsync(async (req, res, next) => {
    const createdUsers = [];

    for (let i = 0; i < req.body.length; i++) {
      const user = req.body[i];

      // Check if the user already exists
      const existingUser = await PatientUser.findOne({
        username: user.username,
      });
      if (existingUser) {
        createdUsers.push({
          status: "fail",
          message: `User with username '${user.username}' already exists!`,
        });
        continue; // Skip creating this user and move to the next one
      }

      // Create a new patient user
      try {
        const clinics = require("./Test Data/clinicData");
        function getRandomClinicId() {
          const randomIndex = Math.floor(Math.random() * clinics.length);
          return clinics[randomIndex]._id.$oid;
        }
        const newUser = await PatientUser.create({
          name: user.name,
          username: user.username,
          password: user.password,
          passwordConfirm: user.passwordConfirm,
          contactInfo: user.contactInfo,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          medicines: user.medicines,
          role: "Patient", // Ensure the role is always set to "Patient"
          clinic: new mongoose.Types.ObjectId(getRandomClinicId()), // Assign random clinic ID
          MRN: generateMRN(),
        });

        createdUsers.push({
          status: "success",
          message: `User '${user.username}' created successfully!`,
          data: {
            user: newUser,
          },
        });
      } catch (error) {
        createdUsers.push({
          status: "fail",
          message: `Error creating user '${user.username}': ${error.message}`,
        });
      }
    }

    res.status(202).json({
      status: "Batch operation completed",
      data: {
        createdUsers,
      },
    });
  })
);

app.use("/", receptionistRouter);
app.use("/admin", adminRouter);
app.use("/", patientRouter);
app.use("/", doctorRouter);
app.use("/", authRouter);

module.exports = app;
