const express = require("express");
const pharmaciesControllers = require("./../../controllers/AdminControllers/pharmaciesControllers");
const authorizeMiddleware = require("../../utils/authorize");
const authController = require("./../../controllers/authController");
const router = express.Router();

const protectAndAuthorize = (action) => [
  authController.protect,
  authorizeMiddleware.authorize(action),
];

// Define Routes
const routes = [
  //Pharmacies Routes
  {
    path: "/getPharmacies",
    method: "get",
    action: pharmaciesControllers.getPharmacies,
    authAction: "Admin",
  },
  {
    path: "/addPharmacy",
    method: "post",
    action: pharmaciesControllers.addPharmacy,
    authAction: "Admin",
  },
  {
    path: "/editPharmacy/:id",
    method: "post",
    action: pharmaciesControllers.editPharmacy,
    authAction: "Admin",
  },
  {
    path: "/deletePharmacy/:id",
    method: "post",
    action: pharmaciesControllers.deletePharmacy,
    authAction: "Admin",
  },
];

// Register Routes
routes.forEach(({ path, method, action, authAction }) => {
  router.route(path)[method](...protectAndAuthorize(authAction), action);
});

module.exports = router;
