import { Router } from "express";
import * as DoctorController from "../controllers/doctor.controller";
import { protect } from "../middleware/auth.middleware";

const doctorRoutes = Router();

// GET LIST OF FILTERED DOCTORS
doctorRoutes.get("/list", DoctorController.getDoctorsListHandler);

// GET THE DETAILS OF A PARTICULAR DOCTOR
doctorRoutes.get("/details/id/:id", DoctorController.getDoctorDetailsHandler);

// UPDATE THE AVAILABILITY OF A PARTICULAR DOCTOR
doctorRoutes.post(
  "/availability/update",
  protect,
  DoctorController.updateDoctorAvailabilityHandler
);

// CHECK WHETHER THE DOCTOR IS AVAILABLE FOR INSTANT BOOKING FOR A PARTICULAR SLOT
doctorRoutes.post("/instant", DoctorController.getInstantDoctors);

export default doctorRoutes;
