import { Router } from "express";
import { Secret } from "../controllers/secret";
import { authMiddleware } from "../middlewares/auth";

const secretRoutes = Router();

secretRoutes.post("/secret/register", authMiddleware, Secret.create);
secretRoutes.get("/secret", authMiddleware, Secret.getSecret);

export default secretRoutes;
