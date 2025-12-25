import { Router } from "express";
import * as ConsultationController from "../controllers/consultation.controller";
import { protect } from "../middleware/auth.middleware";

const consultationRoutes = Router();

consultationRoutes.post(
  "/book",
  protect,
  ConsultationController.paymentAndConsultationBookingHandler
);
consultationRoutes.get(
  "/id/:id",
  ConsultationController.getConsultationByIdHandler
);
consultationRoutes.post(
  "/update/complete",
  protect,
  ConsultationController.updateConsultationStatusHandler
);
consultationRoutes.get(
  "/get",
  protect,
  ConsultationController.getAllConsultationsHandler
);
consultationRoutes.post(
  "/join/id/:id",
  ConsultationController.joinConsultationHandler
);

export default consultationRoutes;
