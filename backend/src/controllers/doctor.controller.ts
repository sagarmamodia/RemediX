import { NextFunction, Request, Response } from "express";
import * as ConsultationRepository from "../repositories/consultation.repository";
import * as DoctorRepository from "../repositories/doctor.repository";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";
import { DoctorFilterQuerySchema } from "../validators/doctorFilter.validator";
import { InstantDoctorsSearchSchema } from "../validators/slot.validator";
import { DAYS } from "./booking.controller";

export const getDoctorDetailsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.body must contain the id of the doctor
    const id: string = req.params.id;
    if (!id) {
      throw new AppError("Invalid data", 400);
    }

    const doctor = await DoctorRepository.getDoctorById(id);
    if (!doctor) {
      throw new AppError("Doctor does not exist", 400);
    }

    return res
      .status(200)
      .json({ success: true, data: { role: "Doctor", ...doctor } });
  } catch (err) {
    return next(err);
  }
};

export const getDoctorsListHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = DoctorFilterQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError("Invalid query params", 400);
    }

    const doctors = await DoctorRepository.getDoctorsList(parsed.data);

    return res.status(200).json({ success: true, data: { list: doctors } });
  } catch (err) {
    return next(err);
  }
};

export const updateDoctorAvailabilityHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (user.role != "Doctor") {
      return new AppError("Only doctors are authorized", 401);
    }

    const data = req.body.available;
    if (!data || (data != "false" && data != "true")) {
      throw new AppError("Invalid data format", 400);
    }
    logger.info("request data parsed");

    // check if doctor is allowed to change its availability
    // if doctor has a consultation then its availability must be set to false he must not be allowed to change it
    const pendingConsultations =
      await ConsultationRepository.getPendingConsultationsByDoctorId(user.id);

    if (pendingConsultations.length > 0) {
      throw new AppError(
        "Doctor have a consultation scheduled - availability can't be changed",
        400
      );
    }

    const availability = data == "true" ? true : false;
    await DoctorRepository.updateDoctorAvailability(user.id, availability);
    logger.info("request availability updated");
    return res.status(200).json({ success: true, data: {} });

    //
  } catch (err) {
    return next(err);
  }
};

// SEND ALL DOCTORS WHO ARE AVAILABLE FOR INSTANT CONSULTATION
export const getInstantDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // parse data
    const parsed = InstantDoctorsSearchSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid data", 400);
    }
    const startTime = new Date(parsed.data.slot[0]);
    const endTime = new Date(parsed.data.slot[1]);
    const dayOfWeek = DAYS[startTime.getDay()];

    // get all available doctors
    const doctors = await DoctorRepository.getAvailableDoctors(
      parsed.data.specialty,
      dayOfWeek,
      startTime,
      endTime
    );

    return res.status(200).json({ success: true, data: { list: doctors } });
  } catch (err) {
    return next(err);
  }
};
