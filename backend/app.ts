import express from "express";
import cors from "cors";
import { config } from "./src/config/index.config";
import { globalErrorHandler } from "./src/middleware/globalErrorHandler.middleware"
import { requestLogger } from "./src/middleware/logger.middleware"


const app = express();

app.use(cors({
    origin: "",
    credentials: config.cors.credentials,
}))

// Log every request
app.use(requestLogger)

app.get("/health", (req, res) => {
    res.json({success: true, data: {}})
})

// Routers

// Global Error Handler
app.use(globalErrorHandler)

export default app;