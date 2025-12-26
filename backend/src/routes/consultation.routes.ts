import { Router } from "express";
import * as BookingController from "../controllers/booking.controller";
import * as ConsultationController from "../controllers/consultation.controller";
import * as PrescriptionController from "../controllers/prescription.controller";
import { protect } from "../middleware/auth.middleware";
import { bufferFileMiddleware } from "../middleware/fileBuffer.middleware";

const consultationRoutes = Router();

// BOOK A CONSULTATION SLOT
consultationRoutes.post(
  "/book",
  protect,
  BookingController.paymentAndSlotBookingHandler
);

// GET A CONSULTATION WITH ID
consultationRoutes.get(
  "/id/:id",
  ConsultationController.getConsultationByIdHandler
);

// MARK A CONSULTATION AS COMPLETE
consultationRoutes.post(
  "/update/complete",
  protect,
  ConsultationController.updateConsultationStatusHandler
);

// GET ALL CONSULTATIONS OF THE LOGGED IN USER
consultationRoutes.get(
  "/get",
  protect,
  ConsultationController.getAllConsultationsHandler
);

// JOIN A CONSULTATION WITH THE GIVEN ID (CREATES A ROOM AND SENDS BACK ROOMID)
consultationRoutes.post(
  "/join/id/:id",
  ConsultationController.joinConsultationHandler
);

// CHECK THE AVAILABILITY OF BOTH DOCTOR AND PATIENT FOR THE GIVEN SLOT
consultationRoutes.post(
  "/checkSlot",
  protect,
  BookingController.checkSlotAvailabilityHandler
);

// RESCHEDULE A CONSULTATION TO A NEW SLOT
consultationRoutes.patch(
  "/reschedule",
  protect,
  BookingController.rescheduleConsultationHandler
);

// UPLOAD PRESCRIPTION
consultationRoutes.patch(
  "/prescription/upload",
  protect,
  bufferFileMiddleware.single("file"),
  PrescriptionController.uploadPrescriptionHandler
);

// GET PRESCRIPTION
consultationRoutes.get(
  "/id/:id/prescription",
  protect,
  PrescriptionController.getPrescriptionHandler
);

export default consultationRoutes;
