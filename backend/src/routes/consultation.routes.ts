import { Router } from "express";
import * as ConsultationController from "../controllers/consultation.controller";
import { protect } from "../middleware/auth.middleware";

const consultationRoutes = Router();

consultationRoutes.use(
  "/book",
  protect,
  ConsultationController.paymentAndConsultationBookingHandler
);

export default consultationRoutes;
