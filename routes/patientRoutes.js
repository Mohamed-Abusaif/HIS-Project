const express = require("express");
const receptionistController = require("../controllers/receptionistController");
const authController = require("./../controllers/authController");
const authorizeMiddleware = require("./../utils/authorize");

const router = express.Router();

router
  .route("/createUser")
  .post(
    authController.protect,
    authorizeMiddleware.authorize("Receptionist"),
    receptionistController.createUser
  );
router
  .route("/getAllUsers")
  .get(
    authController.protect,
    authorizeMiddleware.authorize("Receptionist"),
    receptionistController.getAllUsers
  );

module.exports = router;
