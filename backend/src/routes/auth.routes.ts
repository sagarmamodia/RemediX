import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/patient/register", AuthController.patientRegistrationHandler);
authRoutes.post(
  "/provider/register",
  AuthController.providerRegistrationHandler
);
authRoutes.post("/login", AuthController.loginHandler);

export default authRoutes;
