import { Router } from "express";
import * as DoctorController from "../controllers/doctor.controller";
import { protect } from "../middleware/auth.middleware";
import { bufferFileMiddleware } from "../middleware/fileBuffer.middleware";

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

// UPDATE DOCTOR PROFILE
doctorRoutes.patch(
  "/update",
  bufferFileMiddleware.single("image"),
  protect,
  DoctorController.updateDoctorHandler
);

// CHECK WHETHER THE DOCTOR IS AVAILABLE FOR INSTANT BOOKING FOR A PARTICULAR SLOT
doctorRoutes.post("/instant", DoctorController.getInstantDoctorsHandler);

export default doctorRoutes;
