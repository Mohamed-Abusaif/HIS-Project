const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
// Define base User schema with discriminator key as an enum
const userSchema = new mongoose.Schema({
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
    enum: ["Doctor", "Patient", "Admin", "Receptionist"], // Enum specifying allowed values
    default: "Patient", //it is the most generated user based on the bussiness in the hospital
  },
  passwordChangedAt: Date,
  photo: { type: String },
  //------------------------------------------------------//
  //The previous fields are the common fields of all users
  //------------------------------------------------------//

  //------------------------------------------------------//
  //The next fields will be unique based on the role
  //and will be entered if required but the validation
  //will be in the controller before sending the request
  //to activate the query
  //------------------------------------------------------//
  //Doctors Fields
  specialization: {
    //will be required in the request
    type: String,
  },
  //Patients Fields
  MRN: { type: String }, //will be required in the request
  //medical history field will be an image or a pdf file
  medicalHistory: String,
  medicines: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
  },
  labResults: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LabResults",
  },
  radResults: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RadResults",
  },
  //There is no specific fields for admins and receptionists
});
//all the basic user fields are required because the reciptionist
//is responsible for put all of them at first because it can not be edited later

userSchema.pre("save", async function (next) {
  //Only run this functioin if password was actually modified
  if (!this.isModified("password")) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
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

const User = mongoose.model("User", userSchema);
module.exports = User;
