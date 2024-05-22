const AdminUser = require("../../models/AdminModel");
const PatientUser = require("../../models/PatientModel");
const DoctorUser = require("./../../models/DoctorModel");
const ReceptionistUser = require("./../../models/ReceptionistModel");

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
    userObject = {
      patientDoctors: req.body.patientDoctors,
      medicines: req.body.medicines,
    };
    if (req.files && req.files.labResults) {
      userObject.labResults = req.files.labResults[0].path;
    }
    if (req.files && req.files.radResults) {
      userObject.radResults = req.files.radResults[0].path;
    }
    const patientUser = await PatientUser.findByIdAndUpdate(
      userId,
      userObject,
      {
        new: true,
        runValidators: true,
      }
    );

    if (patientUser) {
      res.status(200).json({
        status: "success",
        message: "Patient Info Updated Successfully",
        patientUser,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "User Not Found!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      error: err.message,
    });
  }
};
exports.editDoctorPatient = async (req, res, next) => {
  const userId = req.params.id;
  try {
    let doctorUser = await DoctorUser.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (doctorUser) {
      res.status(200).json({
        status: "success",
        message: "Doctor Info Updated Successfully",
        doctorUser,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "User Not Found!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      error: err.message,
    });
  }
};

exports.getAllUsers = async (req, res, next) => {
  const allUsers = {
    patientUsers: await PatientUser.find(),
    doctorUsers: await DoctorUser.find(),
    adminUsers: await AdminUser.find(),
    receptionistUsers: await ReceptionistUser.find(),
  };

  res.status(200).json({
    status: "success",
    allUsers,
  });
};
