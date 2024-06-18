const AdminUser = require("../../models/AdminModel");
const PatientUser = require("../../models/PatientModel");
const DoctorUser = require("./../../models/DoctorModel");
const ReceptionistUser = require("./../../models/ReceptionistModel");

const path = require("path");
const upload = require("./../../utils/multerConfig");
const mongoose = require("mongoose");
const fs = require("fs");

//Admin Related Controllers:
exports.getAdminData = async (req, res, next) => {
  adminId = req.params.id;
  adminUser = await AdminUser.findById(adminId);
  if (adminUser) {
    res.status(201).json({
      status: "success",
      adminUser,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message:
        "There is an Error Loading this User's Data Please Try again Later!",
    });
  }
};
// Middleware to handle file uploads
exports.uploadPatientImages = upload.fields([
  { name: "labResults", maxCount: 1 },
  { name: "radResults", maxCount: 1 },
]);

exports.editPatient = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Fetch existing patient data
    const existingPatient = await PatientUser.findById(userId);

    if (!existingPatient) {
      return res.status(404).json({
        status: "fail",
        message: "User Not Found!",
      });
    }

    let userObject = {
      patientDoctors: req.body.patientDoctors,
      medicines: req.body.medicines,
    };

    // Check for new labResults files
    if (req.files && req.files.labResults) {
      if (existingPatient.labResults && existingPatient.labResults.length > 0) {
        // Delete old labResults files
        existingPatient.labResults.forEach((filePath) => {
          fs.unlink(path.resolve(filePath), (err) => {
            if (err) {
              console.error("Failed to delete old labResults file:", err);
            }
          });
        });
      }
      // Update labResults with new file paths
      userObject.labResults = req.files.labResults.map((file) =>
        file.path.replace(/\\/g, "/")
      );
    }

    // Check for new radResults files
    if (req.files && req.files.radResults) {
      if (existingPatient.radResults && existingPatient.radResults.length > 0) {
        // Delete old radResults files
        existingPatient.radResults.forEach((filePath) => {
          fs.unlink(path.resolve(filePath), (err) => {
            if (err) {
              console.error("Failed to delete old radResults file:", err);
            }
          });
        });
      }
      // Update radResults with new file paths
      userObject.radResults = req.files.radResults.map((file) =>
        file.path.replace(/\\/g, "/")
      );
    }

    const patientUser = await PatientUser.findByIdAndUpdate(
      userId,
      userObject,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Patient Info Updated Successfully",
      patientUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      error: err.message,
    });
  }
};
//Doctor Availability Time Routes
exports.editDoctorAvailabilityTime = async (req, res, next) => {
  const doctorId = req.params.id;
  const doctorUser =
    await DoctorUser.findById(doctorId).populate("doctorPatients");
  if (doctorUser) {
    doctorUser.doctorAvailabilityTime = req.body.doctorAvailabilityTime;
    await doctorUser.save();
    res.status(200).json({
      status: "success",
      message: "Doctor Availability Time Updated Successfully",
      doctorUser,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Doctor Not Found!",
    });
  }
};

//API ID return doctor's patients
exports.getDoctorPatient = async (req, res, next) => {
  const doctorId = req.params.id;
  const doctorUser =
    await DoctorUser.findById(doctorId).populate("doctorPatients");
  if (doctorUser) {
    res.status(200).json({
      status: "success",
      doctorUser,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Doctor Not Found!",
    });
  }
};

exports.deleteDoctorPatient = async (req, res, next) => {
  const doctorId = req.params.doctorId;
  const patientId = req.params.patientId;
  const doctorUser = await DoctorUser.findById(doctorId);
  if (doctorUser) {
    const patientIndex = doctorUser.doctorPatients.indexOf(patientId);
    if (patientIndex > -1) {
      doctorUser.doctorPatients.splice(patientIndex, 1);
      await doctorUser.save();
      res.status(200).json({
        status: "success",
        message: "Patient Deleted Successfully",
        //populate the doctorUser to get the patient's data in the response
        doctorUser:
          await DoctorUser.findById(doctorId).populate("doctorPatients"),
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Patient Not Found in Doctor's List!",
      });
    }
  } else {
    res.status(404).json({
      status: "fail",
      message: "Doctor Not Found!",
    });
  }
};

exports.addDoctorPatient = async (req, res, next) => {
  const doctorId = req.params.doctorId;
  const patientId = req.params.patientId;
  const doctorUser = await DoctorUser.findById(doctorId);
  if (doctorUser) {
    doctorUser.doctorPatients.push(patientId);
    await doctorUser.save();
    res.status(200).json({
      status: "success",
      message: "Patient Added Successfully",
      //populate the doctorUser to get the patient's data in the response
      doctorUser:
        await DoctorUser.findById(doctorId).populate("doctorPatients"),
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Doctor Not Found!",
    });
  }
};

//get All Users Route
exports.getAllUsers = async (req, res, next) => {
  const allUsers = {
    patientUsers: await PatientUser.find(),
    doctorUsers: await DoctorUser.find().populate("doctorPatients"),
    adminUsers: await AdminUser.find(),
    receptionistUsers: await ReceptionistUser.find(),
  };

  res.status(200).json({
    status: "success",
    allUsers,
  });
};
