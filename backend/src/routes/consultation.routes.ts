import { Router } from "express";
import * as BookingController from "../controllers/booking.controller";
import * as ConsultationController from "../controllers/consultation.controller";
import { protect } from "../middleware/auth.middleware";

const consultationRoutes = Router();

consultationRoutes.post(
  "/book",
  protect,
  BookingController.paymentAndSlotBookingHandler
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
consultationRoutes.post(
  "/checkSlot",
  protect,
  BookingController.checkSlotAvailabilityHandler
);

consultationRoutes.patch(
  "/reschedule",
  protect,
  BookingController.rescheduleConsultationHandler
);

export default consultationRoutes;
