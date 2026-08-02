const express = require("express");
const Admin = require("./auth.model");
const AuthRepository = require("./auth.repository");
const AuthService = require("./auth.service");
const AuthController = require("./auth.controller");

const router = express.Router();

const authRepository = new AuthRepository(Admin);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
