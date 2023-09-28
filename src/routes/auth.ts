import { Router } from "express";
import { Auth } from "../controllers/auth";

const authRoutes = Router();

authRoutes.post("/auth/register", Auth.Register);
authRoutes.post("/auth/login", Auth.Login);
authRoutes.get("/auth/verify/:otp", Auth.OTPVerification);

export default authRoutes;