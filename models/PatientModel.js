const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { randomBytes } = require("crypto");
const DoctorUser = require("./DoctorModel");

// Define base User schema with discriminator key as an enum
const patientSchema = new mongoose.Schema({
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
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
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
    type: Date,
    required: [true, "Please provide date of birth!"],
  },
  role: {
    type: String,
    required: [true, "Please provide your role in the system!"],
    enum: ["Patient"],
    default: "Patient", //it is the most generated user based on the bussiness in the hospital
  },
  passwordChangedAt: Date,
  photo: { type: String },

  //Patients Fields
  MRN: {
    type: String,
    unique: [
      true,
      "Please Choose another MRN, Just Try to Create The User Again and It will be handled directly!",
    ],
  },
  patientDoctors: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "DoctorUser",
    },
  ],
  medicines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
    },
  ],
  labResults: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabResults",
    },
  ],
  radResults: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RadResults",
    },
  ],
});

patientSchema.pre("save", async function (next) {
  //Only run this functioin if password was actually modified
  if (!this.isModified("password")) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

patientSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

patientSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
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

const PatientUser = mongoose.model("PatientUser", patientSchema);
module.exports = PatientUser;
