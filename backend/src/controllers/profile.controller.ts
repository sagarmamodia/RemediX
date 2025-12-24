import { NextFunction, Request, Response } from "express";
import { PatientDTO } from "../dtos/patient.dto";
import { ProviderDTO } from "../dtos/provider.dto";
import * as PatientRepository from "../repositories/patient.repository";
import * as ProviderRepository from "../repositories/provider.repository";

export const getProfileHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract id and role
    const user = res.locals.user;
    if (user.role == "Provider") {
      const provider: ProviderDTO | null =
        await ProviderRepository.getProviderById(user.id);

      if (!provider) {
        return res
          .status(400)
          .json({ success: false, data: { error: "User does not exist" } });
      }

      return res.json({
        success: true,
        data: { role: "Provider", ...provider },
      });
    } else {
      const patient: PatientDTO | null = await PatientRepository.getPatientById(
        user.id
      );

      if (!patient) {
        return res
          .status(400)
          .json({ success: false, data: { error: "User does not exist" } });
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
