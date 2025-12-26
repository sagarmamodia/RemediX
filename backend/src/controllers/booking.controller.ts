import { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import squareClient from "../config/square.config";
import { CreateConsultationDTO } from "../dtos/consultation.dto";
import * as ConsultationRepository from "../repositories/consultation.repository";
import * as DoctorRepository from "../repositories/doctor.repository";
import * as PaymentRepository from "../repositories/payment.repository";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";
import { BookSlotSchema } from "../validators/bookSlot.validator";
import { CheckSlotSchema } from "../validators/checkSlot.validator";
import { RescheduleSchema } from "../validators/reschedule.validator";

// =============================== HELPER ARRAY ===========================
export const DAYS: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const checkDoctorSlotAvailability = async (
  doctorId: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> => {
  logger.info("fetching doctor details from db");
  const doctor = await DoctorRepository.getDoctorById(doctorId);
  if (!doctor) {
    logger.info("doctor not found");
    return false;
  }
  logger.info("fetched doctor successfully");
  const dayOfWeek = DAYS[startTime.getDay()];
  let validShift = false;

  logger.info("checking shift conflicts");
  const doctorShifts = doctor.shifts;
  for (const shift of doctorShifts) {
    // match day
    const dayOfWeek = DAYS[startTime.getDay()];
    if (dayOfWeek != shift.dayOfWeek) {
      continue;
    }

    // match time
    const startTimeMSM = startTime.getHours() * 60 + startTime.getMinutes();
    const endTimeMSM = endTime.getHours() * 60 + endTime.getMinutes();
    if (startTimeMSM < shift.startTime || endTimeMSM > shift.endTime) {
      continue;
    }

    validShift = true;
    break;
  }

  if (!validShift) {
    logger.info("found shift conflict");
    return false;
  }
  logger.info("not shift conflict found");

  // Check if the doctor have other consultations booked at this time.
  logger.info("fetching consultation for the doctor");
  const doctorConsultations =
    await ConsultationRepository.getPendingConsultationsByDoctorId(doctorId);
  logger.info("fetched consultation for the doctor");

  logger.info("checking slot conflict in doctor's schedule");
  let isDoctorFree = true;
  for (const consultation of doctorConsultations) {
    const consultationStartTime = new Date(consultation.startTime);
    const consultationEndTime = new Date(consultation.endTime);

    // check given slot and consultation slot overlap
    if (startTime < consultationStartTime && endTime > consultationStartTime) {
      isDoctorFree = false;
      break;
    } else if (
      startTime < consultationEndTime &&
      endTime > consultationEndTime
    ) {
      isDoctorFree = false;
      break;
    }
  }

  logger.info("doctor slot conflict detected");
  if (!isDoctorFree) {
    logger.info("doctor slot conflict detected");
    return false;
  }
  logger.info("no doctor slot conflict found");

  return true;
};

const checkPatientSlotAvailability = async (
  patientId: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> => {
  // check if the patient have other consultations booked at this time.
  logger.info("fetching consultation for the doctor");
  const patientConsultations =
    await ConsultationRepository.getPendingConsultationsByPatientId(patientId);
  logger.info("fetched consultation for the doctor");

  logger.info("checking slot conflict in doctor's schedule");
  let isPatientFree = true;
  for (const consultation of patientConsultations) {
    const consultationStartTime = new Date(consultation.startTime);
    const consultationEndTime = new Date(consultation.endTime);

    // check given slot and consultation slot overlap
    if (startTime < consultationStartTime && endTime > consultationStartTime) {
      isPatientFree = false;
      break;
    } else if (
      startTime < consultationEndTime &&
      endTime > consultationEndTime
    ) {
      isPatientFree = false;
      break;
    }
  }

  logger.info("patient slot conflict detected");
  if (!isPatientFree) {
    logger.info("patient slot conflict detected");
    return false;
  }
  logger.info("no patient slot conflict found");

  return true;
};

// ========================================================================

// PROCESS PAYMENT AND BOOK THE CONSULTATION SLOT
export const paymentAndSlotBookingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (user.role != "Patient") {
      throw new AppError("Only patients are authorized", 401);
    }

    const parsed = BookSlotSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid data", 400);
    }
    const doctorId = parsed.data.doctorId;
    const startTime = new Date(parsed.data.slot[0]);
    const endTime = new Date(parsed.data.slot[1]);

    // check if the doctor even exists
    const doctor = await DoctorRepository.getDoctorById(doctorId);
    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }

    // check slot availability
    const doctorCheck = await checkDoctorSlotAvailability(
      doctorId,
      startTime,
      endTime
    );
    const patientCheck = await checkPatientSlotAvailability(
      user.id,
      startTime,
      endTime
    );

    if (!doctorCheck || !patientCheck) {
      return res
        .status(200)
        .json({ success: false, data: { error: "slot not avaliable" } });
    }

    // == PROCEED SLOT BOOKING ==
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
      startTime: startTime,
      endTime: endTime,
      fee: fee,
    };
    const consultationId =
      await ConsultationRepository.createConsultationRecord(data);

    return res
      .status(200)
      .json({ success: true, data: { consultationId: consultationId } });
    //
  } catch (err) {
    return next(err);
  }
};

// CHECK AND RETURN IF THE SLOT IS AVAILABLE FOR BOOKING
export const checkSlotAvailabilityHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (user.role != "Patient") {
      throw new AppError(
        "Only patients are authorized to use this endpoint",
        401
      );
    }

    const parsed = CheckSlotSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid data format", 400);
    }

    const doctor = await DoctorRepository.getDoctorById(parsed.data.doctorId);
    if (!doctor) {
      throw new AppError("Doctor does not exist", 404);
    }

    // check if the doctor is available for bookings
    if (!doctor.available) {
      return false;
    }

    // check if the slot is in the shift of the doctor
    const startTime = new Date(parsed.data.slot[0]);
    const endTime = new Date(parsed.data.slot[1]);

    const doctorCheck = await checkDoctorSlotAvailability(
      parsed.data.doctorId,
      startTime,
      endTime
    );
    const patientCheck = await checkPatientSlotAvailability(
      user.id,
      startTime,
      endTime
    );

    if (!doctorCheck || !patientCheck) {
      return res
        .status(200)
        .json({ success: false, data: { error: "slot not avaliable" } });
    }

    return res.status(200).json({ success: true, data: { validSlot: true } });
  } catch (err) {
    return next(err);
  }
};

// RESCHEDULE A CONSULTATION
export const rescheduleConsultationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (user.role != "Patient") {
      throw new AppError("Only patients are authorized", 401);
    }

    // parse json data
    const parsed = RescheduleSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid data", 400);
    }

    // Check if consultation even exists
    const consultation = await ConsultationRepository.getConsultationById(
      parsed.data.consultationId
    );
    if (!consultation) {
      throw new AppError("Consultation not found", 404);
    }
    const doctorId = consultation.doctorId;
    const startTime = new Date(parsed.data.slot[0]);
    const endTime = new Date(parsed.data.slot[1]);

    // check if the startTime of consultation is less than an hour away
    const sT = new Date(consultation.startTime);
    const diff = sT.getTime() - Date.now(); // in millisecond
    const hour = 60 * 60 * 1000;
    if (diff < hour) {
      throw new AppError("You have exceeded the time to reschedule", 400);
    }

    // check slot availability
    const doctorCheck = await checkDoctorSlotAvailability(
      doctorId,
      startTime,
      endTime
    );
    const patientCheck = await checkPatientSlotAvailability(
      user.id,
      startTime,
      endTime
    );

    if (!doctorCheck || !patientCheck) {
      return res
        .status(200)
        .json({ success: false, data: { error: "slot not avaliable" } });
    }

    // reschdule
    await ConsultationRepository.updateSlot(
      consultation.id,
      startTime,
      endTime
    );

    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return next(err);
  }
};
