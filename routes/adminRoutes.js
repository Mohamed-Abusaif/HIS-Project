const express = require("express");
const adminController = require("../controllers/adminController");
const authController = require("./../controllers/authController");
const authorizeMiddleware = require("./../utils/authorize");

const router = express.Router();

//Admin Routes
router
  .route("/getAdminData/:id")
  .get(
    authController.protect,
    authorizeMiddleware.authorize("Admin"),
    adminController.getAdminData
  );
//Pharmacies Routes
router
  .route("/getPharmacies")
  .get(
    authController.protect,
    authorizeMiddleware.authorize("Admin"),
    adminController.getPharmacies
  );

router
  .route("/addPharmacy")
  .post(
    authController.protect,
    authorizeMiddleware.authorize("Admin"),
    adminController.addPharmacy
  );
router
  .route("/editPharmacy/:id")
  .post(
    authController.protect,
    authorizeMiddleware.authorize("Admin"),
    adminController.editPharmacy
  );
router
  .route("/deletePharmacy/:id")
  .post(
    authController.protect,
    authorizeMiddleware.authorize("Admin"),
    adminController.deletePharmacy
  );

//Medicines Routes
router
  .route("/getMedicines")
  .get(
    authController.protect,
    authorizeMiddleware.authorize("Admin"),
    adminController.getMedicines
  );

router
  .route("/addMedicine")
  .post(
    authController.protect,
    authorizeMiddleware.authorize("Admin"),
    adminController.addMedicine
  );
router
  .route("/editMedicine/:id")
  .post(
    authController.protect,
    authorizeMiddleware.authorize("Admin"),
    adminController.editMedicine
  );
router
  .route("/deleteMedicine/:id")
  .post(
    authController.protect,
    authorizeMiddleware.authorize("Admin"),
    adminController.deleteMedicine
  );
module.exports = router;
