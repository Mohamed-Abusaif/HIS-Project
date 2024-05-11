const express = require("express");
const adminController = require("../controllers/adminController");
const authController = require("./../controllers/authController");
const authorizeMiddleware = require("./../utils/authorize");

const router = express.Router();

// Reusable Middleware for Authentication and Authorization
const protectAndAuthorize = (action) => [
  authController.protect,
  authorizeMiddleware.authorize(action),
];

// Define Routes
const routes = [
  //Admin Routes
  {
    path: "/getAdminData/:id",
    method: "get",
    action: adminController.getAdminData,
    authAction: "Admin",
  },

  //Pharmacies Routes
  {
    path: "/getPharmacies",
    method: "get",
    action: adminController.getPharmacies,
    authAction: "Admin",
  },
  {
    path: "/addPharmacy",
    method: "post",
    action: adminController.addPharmacy,
    authAction: "Admin",
  },
  {
    path: "/editPharmacy/:id",
    method: "post",
    action: adminController.editPharmacy,
    authAction: "Admin",
  },
  {
    path: "/deletePharmacy/:id",
    method: "post",
    action: adminController.deletePharmacy,
    authAction: "Admin",
  },
  //Medicines Routes
  {
    path: "/getMedicines",
    method: "get",
    action: adminController.getMedicines,
    authAction: "Admin",
  },
  {
    path: "/addMedicine",
    method: "post",
    action: adminController.addMedicine,
    authAction: "Admin",
  },
  {
    path: "/editMedicine/:id",
    method: "post",
    action: adminController.editMedicine,
    authAction: "Admin",
  },
  {
    path: "/deleteMedicine/:id",
    method: "post",
    action: adminController.deleteMedicine,
    authAction: "Admin",
  },
];

// Register Routes
routes.forEach(({ path, method, action, authAction }) => {
  router.route(path)[method](...protectAndAuthorize(authAction), action);
});

module.exports = router;
