import express from "express";
import cors from "cors";
import { config } from "./src/config/index.config";
import { globalErrorHandler } from "./src/middleware/globalErrorHandler.middleware";
import { requestLogger } from "./src/middleware/logger.middleware";
import authRoutes from "./src/routes/auth.routes";


const app = express();

app.use(cors({
    origin: "",
    credentials: config.cors.credentials,
}))

// Parse incoming request body in json format
app.use(express.json());

// Log every request
app.use(requestLogger)

app.get("/health", (req, res) => {
    res.json({success: true, data: {}})
})

// Routers
app.use("/api/auth", authRoutes);

// Global Error Handler
app.use(globalErrorHandler)

export default app;