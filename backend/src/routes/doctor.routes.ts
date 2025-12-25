import { Router } from "express";
import * as DoctorController from "../controllers/doctor.controller";
import { protect } from "../middleware/auth.middleware";

const doctorRoutes = Router();

doctorRoutes.get("/list", DoctorController.getDoctorsListHandler);
doctorRoutes.get("/details/id/:id", DoctorController.getDoctorDetailsHandler);
doctorRoutes.post(
  "/availability/update",
  protect,
  DoctorController.updateDoctorAvailabilityHandler
);
doctorRoutes.post("/instant", DoctorController.getInstantDoctors);

export default doctorRoutes;
