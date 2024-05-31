const mongoose = require("mongoose");
const validator = require("validator");
const moment = require("moment");

const bcrypt = require("bcryptjs");
// Define base User schema with discriminator key as an enum

const doctorAvailabilitySchema = new mongoose.Schema({
  time: { type: String, required: true },
  clinicNumber: { type: String, required: true },
  floorInHospital: { type: String, required: true },
});

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please provide name!"] },
  username: {
    type: String,
    required: [true],
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      "Please provide a valid username(Email Format)!",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlength: 8,
    select: false,
  },
  //you don't have to confirm password because the receptionist is responisble for the registration of users
  //you can put it to the reciptionist (it does not matter)
  //just a mechanism for the reciptionist to be sure of the integrity of data
  passwordConfirm: {
    type: String,
    required: [false, "Please confirm your password!"],
    validate: {
      //This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  contactInfo: {
    type: String,
    required: [true, "Please provide the contact information!"],
  },
  gender: {
    type: String,
    required: [true, "Please provide the gender!"],
    enum: ["Male", "Female"],
  },
  dateOfBirth: {
    type: String,
    required: [true, "Please provide date of birth!"],
  },
  role: {
    type: String,
    required: [true, "Please provide your role in the system!"],
    enum: ["Doctor"], // Enum specifying allowed values
    default: "Doctor", //it is the most generated user based on the bussiness in the hospital
  },
  passwordChangedAt: Date,
  photo: { type: String },

  //Doctors Fields
  specialization: {
    type: String,
    required: [true, "Please provide Doctor Specialization!"],
  },
  doctorPatients: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "PatientUser",
    },
  ],
  doctorAvailabilityTime: [doctorAvailabilitySchema],
});

doctorSchema.pre("save", async function (next) {
  //Only run this functioin if password was actually modified
  if (!this.isModified("password")) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

doctorSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

doctorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // console.log(this.passwordChangedAt);

  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const DoctorUser = mongoose.model("DoctorUser", doctorSchema);
module.exports = DoctorUser;
