const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.route("/register").post(authController.register);
router.route("/register-users").post(authController.registerUsers);
router.route("/login").post(authController.login);
router.route("/refresh").get(authController.refreshToken);

module.exports = router;
