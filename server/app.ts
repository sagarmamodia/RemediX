import cors from "cors";
import express, { Request, Response } from "express";
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

// CHECK HEALTH OF THE SERVER
app.get("/api/health", async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, data: { message: "health OK!" } });
});

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// PROFILE ROUTES
app.use("/api/profile", profileRoutes);

// ROUTES RELATED TO DOCTOR
app.use("/api/doctor", doctorRoutes);

// ROUTES RELATED TO PATIENT
app.use("/api/patient", patientRoutes);

// ROUTES RELATED TO CONSULTATION
app.use("/api/consultation", consultationRoutes);

// TEST THE MAIL SERVICE
// app.post("/api/testMail/:mailId", async (req: Request, res: Response) => {
//   try {
//     const mailId = req.params.mailId;
//     if (!mailId)
//       return res
//         .status(400)
//         .json({ success: false, data: { error: "mail id missing" } });
//     await sendMail(
//       mailId,
//       "This is a test mail to verify that mail service is working",
//       { html: "<h1>Mail service is working</h1>" }
//     );
//     return res
//       .status(200)
//       .json({ success: true, data: { error: "Email sent" } });
//   } catch (err) {
//     return res
//       .status(500)
//       .json({ success: false, data: { error: "Email not sent" } });
//   }
// });

// Global Error Handler
app.use(globalErrorHandler);

export default app;
