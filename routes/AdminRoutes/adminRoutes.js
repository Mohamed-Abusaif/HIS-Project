const express = require("express");
const router = express.Router();

const adminController = require("../../controllers/AdminControllers/adminController");
const authController = require("../../controllers/authController");
const authorizeMiddleware = require("../../utils/authorize");

const medicineRoutes = require("./medicinesRoutes");
router.use("/medicines", medicineRoutes);

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
  {
    path: "/editPatient/:id",
    method: "post",
    action: [adminController.uploadPatientImages, adminController.editPatient],
    authAction: "Admin",
  },
  {
    path: "/getAllUsers",
    method: "get",
    action: adminController.getAllUsers,
    authAction: "Admin",
  },
];

// Register Routes
routes.forEach(({ path, method, action, authAction }) => {
  router.route(path)[method](...protectAndAuthorize(authAction), action);
});

module.exports = router;
