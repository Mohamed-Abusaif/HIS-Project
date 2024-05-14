const express = require("express");
const router = express.Router();

const adminController = require("../../controllers/AdminControllers/adminController");
const authController = require("../../controllers/authController");
const authorizeMiddleware = require("../../utils/authorize");

const pharmacyRoutes = require("./pharmaciesRoutes");
router.use("/pharmacies", pharmacyRoutes);
const medicineRoutes = require("./medicinesRoutes");
router.use("/labs", medicineRoutes);
const labsRoutes = require("./labsRoutes");
router.use("/labs", labsRoutes);
const radsRoutes = require("./radsRoutes");
router.use("/rads", radsRoutes);

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
];

// Register Routes
routes.forEach(({ path, method, action, authAction }) => {
  router.route(path)[method](...protectAndAuthorize(authAction), action);
});

module.exports = router;
