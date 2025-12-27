import { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import squareClient from "../config/square.config";
import { CreateConsultationDTO } from "../dtos/consultation.dto";
import { ShiftDTO } from "../dtos/doctor.dto";
import * as ConsultationRepository from "../repositories/consultation.repository";
import * as DoctorRepository from "../repositories/doctor.repository";
import * as PaymentRepository from "../repositories/payment.repository";
import { AppError } from "../utils/AppError";
import { getISTDetails } from "../utils/date";
import { BookSlotSchema } from "../validators/bookSlot.validator";
import { CheckSlotSchema } from "../validators/checkSlot.validator";
import { RescheduleSchema } from "../validators/reschedule.validator";

// =============================== HELPER ARRAY ===========================
export const DAYS: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const doctorShiftCheck = (
  shifts: ShiftDTO[],
  startTime: Date,
  endTime: Date
): boolean => {
  const startTimeIST = getISTDetails(startTime);
  const endTimeIST = getISTDetails(endTime);
  const dayOfWeek = startTimeIST.weekday;
  let validShift = false;

  const doctorShifts = shifts;
  for (const shift of doctorShifts) {
    // match day
    if (dayOfWeek != shift.dayOfWeek) {
      continue;
    }

    // match time
    const startTimeMSM = startTimeIST.hour * 60 + startTimeIST.minute;
    const endTimeMSM = endTimeIST.hour * 60 + endTimeIST.minute;
    if (startTimeMSM < shift.startTime || endTimeMSM > shift.endTime) {
      continue;
    }

    validShift = true;
    break;
  }

  if (!validShift) {
    return false;
  }

  return true;
};

const checkDoctorSlotAvailability = async (
  doctorId: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> => {
  const doctor = await DoctorRepository.getDoctorById(doctorId);
  if (!doctor) {
    return false;
  }

  const startTimeIST = getISTDetails(startTime);
  const endTimeIST = getISTDetails(endTime);
  const dayOfWeek = startTimeIST.weekday;

  // Doctor shift check
  // const validShift = doctorShiftCheck(doctor.shifts, startTime, endTime);
  // if (!validShift) return false;

  // Check if the doctor have other consultations booked at this time.
  const doctorConsultations =
    await ConsultationRepository.getPendingConsultationsByDoctorId(doctorId);

  let isDoctorFree = true;
  for (const consultation of doctorConsultations) {
    const consultationStartTime = new Date(consultation.startTime);
    const consultationEndTime = new Date(consultation.endTime);

    // check given slot and consultation slot overlap
    if (startTime < consultationEndTime && endTime > consultationStartTime) {
      isDoctorFree = false;
      break;
    }
  }

  if (!isDoctorFree) {
    return false;
  }

  return true;
};

const checkPatientSlotAvailability = async (
  patientId: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> => {
  // check if the patient have other consultations booked at this time.
  const patientConsultations =
    await ConsultationRepository.getPendingConsultationsByPatientId(patientId);

  let isPatientFree = true;
  for (const consultation of patientConsultations) {
    const consultationStartTime = new Date(consultation.startTime);
    const consultationEndTime = new Date(consultation.endTime);

    // check given slot and consultation slot overlap
    if (startTime < consultationEndTime && endTime > consultationStartTime) {
      isPatientFree = false;
      break;
    }
  }

  if (!isPatientFree) {
    return false;
  }

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
      throw new AppError("Only patients are authorized", 403);
    }

    const parsed = BookSlotSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid data", 400);
    }
    const doctorId = parsed.data.doctorId;
    const startTime = new Date(parsed.data.slot[0]);
    const endTime = new Date(parsed.data.slot[1]);
    console.log(
      `[INFO] Booking request received for Doctor: ${doctorId} for slot UTC: ${startTime} to ${endTime}`
    );

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
        .status(403)
        .json({ success: false, data: { error: "slot not avaliable" } });
    }
    console.log(`[INFO] Slot availability checks passed`);

    // == PROCEED SLOT BOOKING ==
    const fee = doctor.fee;
    if (!fee) {
      throw new AppError("doctor not found", 400);
    }

    // Charge payment
    console.log(`[INFO] Requesting Square to charge payment: ${fee}`);
    const response = await squareClient.paymentsApi.createPayment({
      sourceId: parsed.data.sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(fee),
        currency: "USD",
      },
    });

    if (!response.result.payment || !response.result.payment.id) {
      console.log(
        `[INFO] Booking request cancelled because of payment failure`
      );
      throw new AppError("Payment failed", 400);
    }
    console.log(`[INFO] Payment successfully charged`);

    // record payment in db
    const paymentId = await PaymentRepository.createPaymentRecord(
      response.result.payment.id,
      fee
    );
    console.log(`[INFO] Payment info saved in DB`);

    // create consultation
    const data: CreateConsultationDTO = {
      doctorId: parsed.data.doctorId,
      patientId: user.id,
      paymentId: paymentId,
      startTime: startTime,
      endTime: endTime,
      symptoms: parsed.data.symptoms,
      fee: fee,
    };
    const consultationId =
      await ConsultationRepository.createConsultationRecord(data);

    console.log(`[INFO] Consultation successfully booked`);

    return res
      .status(201)
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
        403
      );
    }

    const parsed = CheckSlotSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid data format", 400);
    }
    const startTime = new Date(parsed.data.slot[0]);
    const endTime = new Date(parsed.data.slot[1]);

    console.log(
      `[INFO] Request received to check availability of slot UTC: ${startTime} to ${endTime}.`
    );

    const doctor = await DoctorRepository.getDoctorById(parsed.data.doctorId);
    if (!doctor) {
      throw new AppError("Doctor does not exist", 404);
    }

    // check if the doctor is available for bookings
    if (!doctor.available) {
      return false;
    }

    // check if the slot is in available or not
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
        .status(409)
        .json({ success: false, data: { error: "slot not avaliable" } });
    }

    console.log(`[INFO] all checks PASSED slot is available`);
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
      throw new AppError("Only patients are authorized", 403);
    }

    // parse json data
    const parsed = RescheduleSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid data", 400);
    }
    const startTime = new Date(parsed.data.slot[0]);
    const endTime = new Date(parsed.data.slot[1]);
    console.log(
      `[INFO] Request to reschedule consultation with ID: ${parsed.data.consultationId} to new slot UTC: ${startTime} to ${endTime} received.`
    );

    // Check if consultation even exists
    const consultation = await ConsultationRepository.getConsultationById(
      parsed.data.consultationId
    );
    if (!consultation) {
      console.log(
        `[INFO] Rescheduling rejected because consultation doesn't exist`
      );
      throw new AppError("Consultation not found", 404);
    }
    const doctorId = consultation.doctorId;

    // check if the startTime of consultation is less than an hour away
    const sT = new Date(consultation.startTime);
    const diff = sT.getTime() - Date.now(); // in millisecond
    const hour = 60 * 60 * 1000;
    if (diff < hour) {
      throw new AppError("You have exceeded the time to reschedule", 409);
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
        .status(409)
        .json({ success: false, data: { error: "slot not avaliable" } });
    }

    console.log(
      `[INFO] checks PASSED new slot overlap with existing consultations slots for doctor and patients`
    );

    // reschdule
    await ConsultationRepository.updateSlot(
      consultation.id,
      startTime,
      endTime
    );
    console.log(`[INFO] consultation rescheduled successfully`);

    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return next(err);
  }
};
