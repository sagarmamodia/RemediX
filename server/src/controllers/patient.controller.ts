import { NextFunction, Request, Response } from "express";
import * as PatientRepository from "../repositories/patient.repository";
import { AppError } from "../utils/AppError";
import { uploadToCloudinary } from "../utils/cloudinary";
import {
  UpdatePatientDTO,
  UpdatePatientSchema,
} from "../validators/patient.validator";

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
      throw new AppError("Patient does not exist", 404);
    }

    return res
      .status(200)
      .json({ success: true, data: { role: "Patient", ...patient } });
  } catch (err) {
    return next(err);
  }
};

// UPDATE PATIENT PROFILE
export const updatePatientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (user.role !== "Patient") {
      throw new AppError("Only patients are allowed to use this endpoint", 403);
    }

    // parse data
    const parsed = UpdatePatientSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid data format", 400);
    }

    let updates: { profileUrl?: string; otherData: UpdatePatientDTO } = {
      otherData: parsed.data,
    };
    if (req.file) {
      // upload the file to cloudinary
      const result = await uploadToCloudinary(req.file.buffer);
      if (!result.secure_url) {
        throw new AppError("Error uploading file", 500);
      }

      updates.profileUrl = result.secure_url;
    }

    // update db
    const updated = await PatientRepository.updatePatient(user.id, updates);
    return res
      .status(200)
      .json({ success: true, data: { id: user.id, ...updated } });
  } catch (err) {
    return next(err);
  }
};
