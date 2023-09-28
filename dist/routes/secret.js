"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const secret_1 = require("../controllers/secret");
const auth_1 = require("../middlewares/auth");
const secretRoutes = (0, express_1.Router)();
secretRoutes.post("/secret/register", auth_1.authMiddleware, secret_1.Secret.create);
secretRoutes.get("/secret", auth_1.authMiddleware, secret_1.Secret.getSecret);
exports.default = secretRoutes;
