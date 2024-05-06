const express = require("express");
const authController = require("../controllers/authController");

//this is for creating users which is the job of the receptionist only
//user can not create account by himself
const router = express.Router();

router.post("/login", authController.login);

module.exports = router;
