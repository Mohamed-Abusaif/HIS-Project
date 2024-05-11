const multer = require("multer");
const path = require("path");

const PatientUser = require("./../models/PatientModel");
const DoctorUser = require("./../models/DoctorModel");
const AdminUser = require("./../models/AdminModel");
const ReceptionistUser = require("./../models/ReceptionistModel");
const generateMRN = require("./../utils/generateMRN");
const catchAsync = require("../utils/catchAsync");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "UsersPhotos"); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    const username = req.body.username; // Get the username from request body
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, `${username}${ext}`); // Set the filename as username + extension
  },
});

// Multer upload configuration
const upload = multer({ storage: storage });
exports.uploadUserPhoto = upload.single("photo"); // Assuming your file input name is "photo"

exports.createUser = catchAsync(async (req, res, next) => {
  const {
    name,
    username,
    password,
    passwordConfirm,
    contactInfo,
    gender,
    dateOfBirth,
    role,
  } = req.body;

  const userModels = {
    Patient: PatientUser,
    Doctor: DoctorUser,
    Admin: AdminUser,
    Receptionist: ReceptionistUser,
  };

  const UserModel = userModels[role];

  if (!UserModel) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid role provided",
    });
  }

  const existingUser = await UserModel.findOne({ username });

  if (existingUser) {
    return res.status(401).json({
      status: "fail",
      message: "This username is already taken!",
    });
  }

  const newUser = await UserModel.create({
    name,
    username,
    password,
    passwordConfirm,
    contactInfo,
    gender,
    dateOfBirth,
    role,
    ...(req.file && { photo: req.file.filename }), // Conditionally add photo if it exists
  });

  res.status(202).json({
    status: "success",
    message: "User created successfully!",
    data: { user: newUser },
  });
});

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

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (await PatientUser.findById(userId)) {
      await PatientUser.findByIdAndDelete(userId);
    } else if (await DoctorUser.findById(userId)) {
      await DoctorUser.findByIdAndDelete(userId);
    } else if (await AdminUser.findById(userId)) {
      await AdminUser.findByIdAndDelete(userId);
    } else if (await ReceptionistUser.findById(userId)) {
      await ReceptionistUser.findByIdAndDelete(userId);
    } else {
      // If user is not found in any collection, return 404
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(201).json({
      status: "success",
      message: "User Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      error: err.message,
    });
  }
};

exports.editUserInfo = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const patientUser = await PatientUser.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    const doctorUser = await DoctorUser.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    const adminUser = await AdminUser.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    const receptionistUser = await ReceptionistUser.findByIdAndUpdate(
      userId,
      req.body,
      {
        new: true,
      }
    );

    if (patientUser) {
      res.status(201).json({
        status: "success",
        message: "Patient Info Updated Successfully",
        patientUser,
      });
    } else if (doctorUser) {
      res.status(201).json({
        status: "success",
        message: "Doctor Info Updated Successfully",
        doctorUser,
      });
    } else if (adminUser) {
      res.status(201).json({
        status: "success",
        message: "Admin Info Updated Successfully",
        adminUser,
      });
    } else if (receptionistUser) {
      res.status(201).json({
        status: "success",
        message: "Receptionist Info Updated Successfully",
        receptionistUser,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "User Not Found!",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      error: err,
    });
  }
};
