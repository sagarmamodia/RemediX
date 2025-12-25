import { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import squareClient from "../config/square.config";
import { CreateConsultationDTO } from "../dtos/consultation.dto";
import * as ConsultationRepository from "../repositories/consultation.repository";
import * as doctorRepository from "../repositories/doctor.repository";
import * as PaymentRepository from "../repositories/payment.repository";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";
import { createRoomAPI, deleteRoomAPI } from "../utils/room";
import { BookConsultationSchema } from "../validators/consultation.validator";

export const paymentAndConsultationBookingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (user.role != "Patient") {
      throw new AppError("Only patients can book consultation", 400);
    }

    // parse json payload
    const parsed = BookConsultationSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid data format", 400);
    }

    // check if provided is available or not
    const doctor = await doctorRepository.getDoctorById(parsed.data.doctorId);
    if (!doctor) {
      throw new AppError("doctor not found", 400);
    }
    if (!doctor.available) {
      throw new AppError("doctor not available", 400);
    }

    const fee = doctor.fee;
    if (!fee) {
      throw new AppError("doctor not found", 400);
    }

    // Charge payment
    const response = await squareClient.paymentsApi.createPayment({
      sourceId: parsed.data.sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(fee),
        currency: "USD",
      },
    });

    if (!response.result.payment || !response.result.payment.id) {
      throw new AppError("Payment failed", 400);
    }
    logger.info("payment charged");

    // record payment in db
    const paymentId = await PaymentRepository.createPaymentRecord(
      response.result.payment.id,
      fee
    );

    logger.info("payment recorded");

    // create consultation
    const data: CreateConsultationDTO = {
      doctorId: parsed.data.doctorId,
      patientId: user.id,
      paymentId: paymentId,
    };
    const consultationId =
      await ConsultationRepository.createConsultationRecord(data);
    logger.info("consultation created");

    // set doctor availability to false
    await doctorRepository.updateDoctorAvailability(
      parsed.data.doctorId,
      false
    );

    logger.info("doctor availability set to false");

    return res
      .status(200)
      .json({ success: true, data: { id: consultationId } });
  } catch (err) {
    return next(err);
  }
};

export const getConsultationByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new AppError("Invalid url parameter", 400);
    }

    const consultation = await ConsultationRepository.getConsultationById(id);
    if (!consultation) {
      throw new AppError("Consultation does not exist", 404);
    }

    return res.status(200).json({
      success: true,
      data: consultation,
    });
  } catch (err) {
    return next(err);
  }
};

// GET ALL CONSULTATIONS (PENDING AND COMPLETED)
export const getAllConsultationsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    if (user.role == "doctor") {
      const consultations =
        await ConsultationRepository.getAllConsultationsByDoctorId(user.id);

      return res
        .status(200)
        .json({ success: true, data: { list: consultations } });
    } else {
      const consultations =
        await ConsultationRepository.getAllConsultationsByPatientId(user.id);

      return res
        .status(200)
        .json({ success: true, data: { list: consultations } });
    }
  } catch (err) {
    return next(err);
  }
};

export const updateConsultationStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (user.role != "doctor") {
      throw new AppError("Only doctors are authorized", 401);
    }

    const id = req.body.id;
    if (!id) {
      throw new AppError("Invalid data", 400);
    }

    // Check if doctor has the permission to update this consultation
    const consultation = await ConsultationRepository.getConsultationById(id);
    if (!consultation) {
      throw new AppError("Consultation does not exist", 404);
    }

    if (consultation.doctorId != user.id) {
      throw new AppError("You are unauthorized", 401);
    }

    // Check if the consultation have a room associated with it
    if (consultation.roomName) {
      await deleteRoomAPI(consultation.roomName);
      await ConsultationRepository.deleteRoom(consultation.id);
    }

    // Update the status to completed
    await ConsultationRepository.updateConsultationStatus(id, "completed");
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return next(err);
  }
};

export const joinConsultationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const consultationId = req.params.id;
    if (!consultationId) {
      throw new AppError("ConsultationId not found in the url", 400);
    }

    // fetch consultation
    const consultation = await ConsultationRepository.getConsultationById(
      consultationId
    );
    if (!consultation) {
      throw new AppError("Consultation does not exist", 404);
    }

    // get url from consultation
    const roomUrl = consultation.roomUrl;

    // create room if it does not exist
    if (!roomUrl) {
      const { newRoomUrl, newRoomName } = await createRoomAPI();

      // save this roomUrl to consultation
      await ConsultationRepository.addRoom(
        consultation.id,
        newRoomUrl,
        newRoomName
      );

      return res
        .status(200)
        .json({ success: true, data: { roomUrl: newRoomUrl } });
    }

    return res.status(200).json({ success: true, data: { roomUrl: roomUrl } });
  } catch (err) {
    return next(err);
  }
};
