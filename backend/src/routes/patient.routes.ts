import { Router } from "express";
import * as PatientController from "../controllers/patient.controller";

const patientRoutes = Router();

patientRoutes.get(
  "/details/id/:id",
  PatientController.getPatientDetailsHandler
);

export default patientRoutes;
