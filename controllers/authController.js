const jwt = require("jsonwebtoken");
const { promisify } = require("util");
// const User = require("../models/UserModel");

const PatientUser = require("./../models/PatientModel");
const DoctorUser = require("./../models/DoctorModel");
const AdminUser = require("./../models/AdminModel");
const ReceptionistUser = require("./../models/ReceptionistModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
//for login functionality for all users

//From the client send username - password - role (via buttons login as doctor,patient,admin or reciptionist)
exports.login = catchAsync(async (req, res, next) => {
  const { username, password, role } = req.body;

  //1) Check if email and password exist
  if (!username || !password || !role) {
    return next(
      new AppError("Please provide username and password and role!", 400)
    );
  }

  //2) Check if user exist and password is correct
  let user = undefined;
  if (role === "Patient") {
    user = await PatientUser.findOne({ username: username }).select(
      "+password"
    );
    console.log(user);
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect username or password", 401));
    }
  }
  if (role === "Doctor") {
    user = await DoctorUser.findOne({ username: username }).select("+password");
    console.log(user);
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect username or password", 401));
    }
  }
  if (role === "Admin") {
    user = await AdminUser.findOne({ username: username }).select("+password");
    console.log(user);
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect username or password", 401));
    }
  }
  if (role === "Receptionist") {
    user = await ReceptionistUser.findOne({ username: username }).select(
      "+password"
    );
    console.log(user);
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect username or password", 401));
    }
  }

  // const user = await User.findOne({ username: username }).select("+password");
  // console.log(user);
  // if (!user || !(await user.correctPassword(password, user.password))) {
  //   return next(new AppError("Incorrect username or password", 401));
  // }

  //3) If everything is ok, Send the token to client
  //creating the token:
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting token and check if it's there (exists)
  let token;
  console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("Your are not logged in! Please login to get access!", 401)
    );
  }
  //2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists
  let currentUser = undefined;

  const admin = await AdminUser.findById(decoded.id);
  if (admin) {
    currentUser = admin;
  }
  const patient = await PatientUser.findById(decoded.id);
  if (patient) {
    currentUser = patient;
  }
  const doctor = await DoctorUser.findById(decoded.id);
  if (doctor) {
    currentUser = doctor;
  }
  const receptionist = await ReceptionistUser.findById(decoded.id);
  if (receptionist) {
    currentUser = receptionist;
  }
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist!")
    );
  }
  //4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  //next() Grant Access To Protected Route
  req.user = currentUser;
  next();
});
