"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const secret_1 = __importDefault(require("./routes/secret"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware setup
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: "20mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "20mb", extended: true }));
// Routes setup
app.use("/api", auth_1.default);
app.use("/api", secret_1.default);
// Start server
const PORT = process.env.PORT || 3000;
mongoose_1.default
    .connect(process.env.MONGODB_URI || "")
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("MongoDB connection error:", err);
});
