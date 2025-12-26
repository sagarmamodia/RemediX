import { NextFunction, Request, Response } from "express";
import * as PatientRepository from "../repositories/patient.repository";
import { AppError } from "../utils/AppError";

// SEND DETAILS OF THE PATIENT MATCHING THE ID GIVEN IN URL PARAMS
export const getPatientDetailsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.body must contain the id of the provider
    const id: string = req.params.id;
    if (!id) {
      throw new AppError("Invalid data", 400);
    }

    const patient = await PatientRepository.getPatientById(id);
    if (!patient) {
      throw new AppError("Patient does not exist", 400);
    }

    return res
      .status(200)
      .json({ success: true, data: { role: "Patient", ...patient } });
  } catch (err) {
    return next(err);
  }
};
