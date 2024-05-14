const express = require("express");
const radsControllers = require("./../../controllers/AdminControllers/radsController");
const authorizeMiddleware = require("../../utils/authorize");
const authController = require("./../../controllers/authController");
const router = express.Router();

const protectAndAuthorize = (action) => [
  authController.protect,
  authorizeMiddleware.authorize(action),
];

const routes = [
  {
    path: "/getRads",
    method: "get",
    action: radsControllers.getRads,
    authAction: "Admin",
  },
  {
    path: "/addRad",
    method: "post",
    action: radsControllers.addRad,
    authAction: "Admin",
  },
  {
    path: "/editRad/:id",
    method: "post",
    action: radsControllers.editRad,
    authAction: "Admin",
  },
  {
    path: "/deleteRad/:id",
    method: "post",
    action: radsControllers.deleteRad,
    authAction: "Admin",
  },
];

routes.forEach(({ path, method, action, authAction }) => {
  router.route(path)[method](...protectAndAuthorize(authAction), action);
});

module.exports = router;
