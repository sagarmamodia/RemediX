import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";

const authRoutes = Router();

// ROUTE TO REGISTER A NEW PATIENT
authRoutes.post("/patient/register", AuthController.patientRegistrationHandler);

// ROUTE TO REGISTER A NEW DOCTOR
authRoutes.post("/doctor/register", AuthController.doctorRegistrationHandler);

// ROUTE TO LOGIN
authRoutes.post("/login", AuthController.loginHandler);

export default authRoutes;
