import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import * as DoctorRepository from "../repositories/doctor.repository";
import * as PatientRepository from "../repositories/patient.repository";
import { AppError } from "../utils/AppError";
import { generateAccessToken } from "../utils/jwt";
import { CreateDoctorSchema } from "../validators/doctor.validator";
import { LoginSchema } from "../validators/login.validator";
import { CreatePatientSchema } from "../validators/patient.validator";

// REGISTER A NEW PATIENT
export const patientRegistrationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Parse data from the request
    const data = req.body;
    const parsed = CreatePatientSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError("Invalid data", 400);
    }

    // check if patient already exists
    const patient = await PatientRepository.getPatientByEmailWithPassword(
      parsed.data.email
    );
    if (patient) {
      throw new AppError("Patient already registered", 409);
    }

    // Register patient in the repository
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsed.data.password, salt);
    parsed.data.password = hashedPassword;
    const id = await PatientRepository.registerPatient(parsed.data);
    console.log(id);

    // return response
    return res.status(201).json({ success: true, data: { id: id } });
  } catch (error) {
    return next(error);
  }
};

// REGISTER A NEW DOCTOR
export const doctorRegistrationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Parse data from the request
    const data = req.body;
    const parsed = CreateDoctorSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError("Invalid data", 400);
    }

    // check if doctor already registered
    const doctor = await DoctorRepository.getDoctorByEmailWithPassword(
      parsed.data.email
    );

    if (doctor) {
      throw new AppError("Doctor already registered", 409);
    }

    // Register patient in the repository
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsed.data.password, salt);
    parsed.data.password = hashedPassword;
    const id = await DoctorRepository.registerDoctor(parsed.data);

    // return response
    return res.status(201).json({ success: true, data: { id: id } });
  } catch (error) {
    return next(error);
  }
};

// LOGIN AS AN EXISTING USER AND RECEIVES A JWT TOKEN
export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid data", 400);
    }

    const data = parsed.data;
    let account: { id: string; passwordHash: string } | null = null;
    // Authenticate user
    if (data.role == "Doctor") {
      account = await DoctorRepository.getDoctorByEmailWithPassword(data.email);
    } else {
      account = await PatientRepository.getPatientByEmailWithPassword(
        data.email
      );
    }

    // if no account exists with this phone number
    if (!account) {
      return res
        .status(404)
        .json({ success: false, data: { error: "user does not exist" } });
    }

    // if a Doctor exists with this phone number then match passwords and return access token
    const passwordMatch = await bcrypt.compare(
      data.password,
      account.passwordHash
    );
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ success: false, data: { error: "Invalid password" } });
    }
    const token = generateAccessToken(account.id, data.role);
    return res
      .status(200)
      .json({ success: true, data: { accessToken: token } });
  } catch (error) {
    return next(error);
  }
};
