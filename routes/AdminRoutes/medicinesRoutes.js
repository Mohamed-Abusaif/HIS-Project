const express = require("express");
const medicinesControllers = require("./../../controllers/AdminControllers/medicinesControllers");
const authorizeMiddleware = require("../../utils/authorize");
const authController = require("./../../controllers/authController");
const router = express.Router();

const protectAndAuthorize = (action) => [
  authController.protect,
  authorizeMiddleware.authorize(action),
];

// Define Routes
const routes = [
  //Medicines Routes
  {
    path: "/getMedicines",
    method: "get",
    action: medicinesControllers.getMedicines,
    authAction: "Admin",
  },
  {
    path: "/addMedicine",
    method: "post",
    action: medicinesControllers.addMedicine,
    authAction: "Admin",
  },
  {
    path: "/editMedicine/:id",
    method: "post",
    action: medicinesControllers.editMedicine,
    authAction: "Admin",
  },
  {
    path: "/deleteMedicine/:id",
    method: "post",
    action: medicinesControllers.deleteMedicine,
    authAction: "Admin",
  },
];

// Register Routes
routes.forEach(({ path, method, action, authAction }) => {
  router.route(path)[method](...protectAndAuthorize(authAction), action);
});

module.exports = router;
