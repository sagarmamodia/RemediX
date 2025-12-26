import { NextFunction, Request, Response } from "express";
import { DoctorDTO } from "../dtos/doctor.dto";
import { PatientDTO } from "../dtos/patient.dto";
import * as DoctorRepository from "../repositories/doctor.repository";
import * as PatientRepository from "../repositories/patient.repository";
import { AppError } from "../utils/AppError";

// SEND THE PROFILE OF LOGGED IN USER
export const getProfileHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract id and role
    const user = res.locals.user;
    if (user.role == "Doctor") {
      const doctor: DoctorDTO | null = await DoctorRepository.getDoctorById(
        user.id
      );

      if (!doctor) {
        throw new AppError("User does not exist", 400);
      }

      return res.json({
        success: true,
        data: { role: "Doctor", ...doctor },
      });
    } else {
      const patient: PatientDTO | null = await PatientRepository.getPatientById(
        user.id
      );

      if (!patient) {
        throw new AppError("User does not exist", 400);
      }

      return res.json({
        success: true,
        data: { role: "Patient", ...patient },
      });
    }
  } catch (err) {
    return next(err);
  }
};
