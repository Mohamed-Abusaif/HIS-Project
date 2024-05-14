const express = require("express");
const labsController = require("./../../controllers/AdminControllers/labsController");
const authorizeMiddleware = require("../../utils/authorize");
const authController = require("./../../controllers/authController");
const router = express.Router();

const protectAndAuthorize = (action) => [
  authController.protect,
  authorizeMiddleware.authorize(action),
];

// Define Routes
const routes = [
  //Labs Routes
  {
    path: "/getLabs",
    method: "get",
    action: labsController.getLabs,
    authAction: "Admin",
  },
  {
    path: "/addLab",
    method: "post",
    action: labsController.addLab,
    authAction: "Admin",
  },
  {
    path: "/editLab/:id",
    method: "post",
    action: labsController.editLab,
    authAction: "Admin",
  },
  {
    path: "/deleteLab/:id",
    method: "post",
    action: labsController.deleteLab,
    authAction: "Admin",
  },
];

// Register Routes
routes.forEach(({ path, method, action, authAction }) => {
  router.route(path)[method](...protectAndAuthorize(authAction), action);
});

module.exports = router;
