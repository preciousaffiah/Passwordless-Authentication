"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const authRoutes = (0, express_1.Router)();
authRoutes.post("/auth/register", auth_1.Auth.Register);
authRoutes.post("/auth/login", auth_1.Auth.Login);
authRoutes.get("/auth/verify/:otp", auth_1.Auth.OTPVerification);
exports.default = authRoutes;
