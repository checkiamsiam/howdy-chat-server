const express = require("express");
const authControllers = require("../controllers/auth.controller");
const protect = require("../middleware/verifyAuth");
const authRoute = express.Router();

authRoute.post("/auth/signup", authControllers.register);
authRoute.post("/auth/login", authControllers.login);
authRoute.get("/auth/user/me", protect , authControllers.getMe);

module.exports = authRoute;
