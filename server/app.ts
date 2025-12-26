import cors from "cors";
import express from "express";
import { config } from "./src/config/index.config";
import { globalErrorHandler } from "./src/middleware/globalErrorHandler.middleware";
import { requestLogger } from "./src/middleware/logger.middleware";
import authRoutes from "./src/routes/auth.routes";
import consultationRoutes from "./src/routes/consultation.routes";
import doctorRoutes from "./src/routes/doctor.routes";
import patientRoutes from "./src/routes/patient.routes";
import profileRoutes from "./src/routes/profile.routes";

const app = express();

app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);

// Parse incoming request body in json format
app.use(express.json());

// Log every request
app.use(requestLogger);

app.get("/health", (req, res) => {
  res.json({ success: true, data: {} });
});

// Routers
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/consultation", consultationRoutes);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
