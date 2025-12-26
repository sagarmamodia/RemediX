import { NextFunction, Request, Response } from "express";
import * as ConsultationRepository from "../repositories/consultation.repository";
import { AppError } from "../utils/AppError";
import { uploadToCloudinary } from "../utils/cloudinary";

// UPLOAD PRESCRIPTION FOR A CONSULTATION
export const uploadPrescriptionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (user.role !== "Doctor") {
      throw new AppError(
        "Only doctors are authorized to use this endpoint",
        400
      );
    }

    // parse consultation id
    const consultationId = req.body.consultationId;
    if (!consultationId) {
      throw new AppError("consultationId missing", 400);
    }

    // check if file is sent
    if (!req.file) {
      throw new AppError("File missing", 400);
    }

    // check if the consultation exists
    const consultation = await ConsultationRepository.getConsultationById(
      consultationId
    );
    if (!consultation) {
      throw new AppError("Consultation does not exist", 400);
    }

    // check if the consultation has started
    const sT = new Date(consultation.startTime);
    const currentTime = new Date(Date.now());
    if (sT > currentTime) {
      throw new AppError(
        "Consultation has not yet started - you can't upload prescription",
        400
      );
    }

    // upload file to cloudinary
    const result = await uploadToCloudinary(req.file.buffer);
    if (!result.secure_url) {
      throw new AppError("Error uploading file", 400);
    }

    // update prescription Url
    await ConsultationRepository.updatePrescriptionUrl(
      consultationId,
      result.secure_url
    );

    return res
      .status(200)
      .json({ success: true, data: { prescriptionUrl: result.secure_url } });
  } catch (err) {
    if (err instanceof AppError)
      return new AppError(`[REPOSITORY] ${err.message}`, err.statusCode);

    if (err instanceof Error)
      return next(new Error(`[CONTROLLER] ${err.message}`));
  }
};

// SEND PRESCRIPTION ASSOCIATED WITH A CONSULTATION
export const getPrescriptionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const consultationId = req.params.id;
    if (!consultationId) {
      throw new AppError("Consultation id missing", 400);
    }

    // check if the consultation exists
    const consultation = await ConsultationRepository.getConsultationById(
      consultationId
    );
    if (!consultation) {
      throw new AppError("Consultation does not exist", 404);
    }
    if (!consultation.prescriptionUrl) {
      throw new AppError("Prescription has not been uploaded", 404);
    }

    if (user.role === "Doctor") {
      // check if doctor have this consultation associated with him/her
      if (consultation.doctorId != user.id) {
        throw new AppError(
          "You have no association with this consultation",
          404
        );
      }

      return res.status(200).json({
        success: true,
        data: { prescriptionUrl: consultation.prescriptionUrl },
      });
    } else if (user.role === "Patient") {
      // check if patient have this consultation associated with him/her
      if (consultation.patientId != user.id) {
        throw new AppError(
          "You have no association with this consultation",
          404
        );
      }

      return res.status(200).json({
        success: true,
        data: { prescriptionUrl: consultation.prescriptionUrl },
      });
    }
  } catch (err) {
    return next(err);
  }
};
