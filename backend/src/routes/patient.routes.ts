import { Router } from "express";
import * as PatientController from "../controllers/patient.controller";
import { protect } from "../middleware/auth.middleware";
import { bufferFileMiddleware } from "../middleware/fileBuffer.middleware";

const patientRoutes = Router();

// GET THE DETAILS OF A PARTICULAR PATIENT
patientRoutes.get(
  "/details/id/:id",
  PatientController.getPatientDetailsHandler
);

patientRoutes.patch(
  "/update",
  bufferFileMiddleware.single("image"),
  protect,
  PatientController.updatePatientHandler
);

export default patientRoutes;
