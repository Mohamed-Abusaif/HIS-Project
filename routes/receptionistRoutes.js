const express = require("express");
const receptionistController = require("../controllers/receptionistController");
const authController = require("./../controllers/authController");
const authorizeMiddleware = require("./../utils/authorize");
//this is for creating users which is the job of the receptionist only
//user can not create account by himself
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
router
  .route("/deleteUser/:id")
  .post(
    authController.protect,
    authorizeMiddleware.authorize("Receptionist"),
    receptionistController.deleteUser
  );
router
  .route("/editUserInfo/:id")
  .post(
    authController.protect,
    authorizeMiddleware.authorize("Receptionist"),
    receptionistController.editUserInfo
  );

module.exports = router;
