const express = require("express");
const doctorController = require("../controllers/doctorController");
const authController = require("./../controllers/authController");
const authorizeMiddleware = require("./../utils/authorize");

const router = express.Router();

router
  .route("/getDoctorData/:id")
  .get(
    authController.protect,
    authorizeMiddleware.authorize("Doctor"),
    doctorController.getDoctorData
  );

module.exports = router;
