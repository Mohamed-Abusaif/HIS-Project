const express = require("express");
const patientController = require("../controllers/patientController");
const authController = require("./../controllers/authController");
const authorizeMiddleware = require("./../utils/authorize");

const router = express.Router();

router
  .route("/getPatientData/:id")
  .get(
    authController.protect,
    authorizeMiddleware.authorize("Patient"),
    patientController.getPatientData
  );

router
  .route("/downloadPatientData/:id")
  .get(
    authController.protect,
    authorizeMiddleware.authorize("Patient"),
    patientController.downloadPatientData
  );
module.exports = router;
