const express = require("express");
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const router = express.Router();

/**
 * @route POST api/auth/login
 * @description Login with email and password
 * @access Public
 */
router.post("/login", authController.loginWithEmail);

module.exports = router;
