const express = require("express");
const adminController = require("../controllers/adminController");
const authController = require("./../controllers/authController");
const authorizeMiddleware = require("./../utils/authorize");

const router = express.Router();

router
  .route("/getAdminData/:id")
  .get(
    authController.protect,
    authorizeMiddleware.authorize("Admin"),
    adminController.getAdminData
  );

module.exports = router;
