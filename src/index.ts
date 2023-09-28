import express from "express";
import cors from "cors";
import bodyParser from "body-parser"
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import secretRoutes from "./routes/secret";


dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

// Routes setup
app.use("/api", authRoutes);
app.use("/api", secretRoutes);
 

// Start server
const PORT = process.env.PORT || 3000;
mongoose
.connect(process.env.MONGODB_URI || "")
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});
