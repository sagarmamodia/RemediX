import { NextFunction, Request, Response } from "express";
import {
  DoctorConsultationsDTO,
  PatientConsultationsDTO,
} from "../dtos/consultation.dto";
import * as ConsultationRepository from "../repositories/consultation.repository";
import * as DoctorRepository from "../repositories/doctor.repository";
import * as PatientRepository from "../repositories/patient.repository";
import { AppError } from "../utils/AppError";
import {
  createRoomAPI,
  deleteRoomAPI,
  getVideoSDKToken,
} from "../utils/videosdk";

// SEND CONSULTATION DETAILS FOR A PARTICULAR ID
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

// RETRIEVE ALL CONSULTATIONS OF THE LOGGED IN USER
export const getAllConsultationsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    if (user.role == "Doctor") {
      const consultations =
        await ConsultationRepository.getAllConsultationsByDoctorId(user.id);

      // get patient details corressponding to each patientId
      const data: DoctorConsultationsDTO[] = [];
      for (const consultation of consultations) {
        try {
          const patient = await PatientRepository.getPatientById(
            consultation.patientId
          );

          const obj: any = {};
          if (patient) {
            obj.consultationId = consultation.id;
            obj.patientName = patient.name;
            obj.patientProfileUrl = patient.profileUrl;
            obj.startTime = consultation.startTime;
            obj.endTime = consultation.endTime;
            obj.prescriptionUrl = consultation.prescriptionUrl;
            obj.status = consultation.status;
            data.push(obj);
          }
        } catch (err) {}
      }

      return res.status(200).json({ success: true, data: { list: data } });
    } else {
      const consultations =
        await ConsultationRepository.getAllConsultationsByPatientId(user.id);

      const data: PatientConsultationsDTO[] = [];
      for (const consultation of consultations) {
        try {
          const doctor = await DoctorRepository.getDoctorById(
            consultation.doctorId
          );
          const obj: any = {};
          if (doctor) {
            obj.consultationId = consultation.id;
            obj.doctorName = doctor.name;
            obj.doctorProfileUrl = doctor.profileUrl;
            obj.startTime = consultation.startTime;
            obj.endTime = consultation.endTime;
            obj.prescriptionUrl = consultation.prescriptionUrl;
            obj.status = consultation.status;
            obj.doctorSpecialty = doctor.specialty;
            data.push(obj);
          }
        } catch (err) {}
      }

      return res.status(200).json({ success: true, data: { list: data } });
    }
  } catch (err) {
    return next(err);
  }
};

// MARK A CONSULTATION AS COMPLETE
export const updateConsultationStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (user.role != "Doctor") {
      throw new AppError("Only doctors are authorized", 403);
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
      throw new AppError("You are unauthorized", 403);
    }

    // Check if the consultation have a room associated with it
    if (consultation.roomId) {
      await deleteRoomAPI(consultation.roomId);
      await ConsultationRepository.deleteRoom(consultation.id);
    }

    // Update the status to completed
    await ConsultationRepository.updateConsultationStatus(id, "completed");
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return next(err);
  }
};

// JOIN A CONSULTATION (SEND ROOMID TO FRONTEND) - THIS GENERATES A NEW ROOM IF NO ROOM HAS BEEN GENERATED SO FAR
export const joinConsultationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const consultationId = req.params.id;
    if (!consultationId) {
      throw new AppError("ConsultationId missing", 400);
    }

    // fetch consultation
    const consultation = await ConsultationRepository.getConsultationById(
      consultationId
    );
    if (!consultation) {
      throw new AppError("Consultation does not exist", 404);
    }

    // if the time to start the consultation is greater than 10 minutes then reject the request
    const startTime = new Date(consultation.startTime);
    const diff = (startTime.getTime() - Date.now()) / (1000 * 60);
    if (diff > 10) {
      throw new AppError(
        "You can only join 10 minutes before consultation starts",
        403
      );
    }

    // get url from consultation
    const roomId = consultation.roomId;
    const token = getVideoSDKToken();
    // create room if it does not exist
    if (!roomId) {
      const newRoomId = await createRoomAPI();
      if (!newRoomId) {
        throw new AppError("Error in creating room", 500);
      }

      // save this roomUrl to consultation
      await ConsultationRepository.addRoom(consultation.id, newRoomId);

      return res
        .status(200)
        .json({ success: true, data: { roomId: newRoomId, token: token } });
    }

    return res
      .status(200)
      .json({ success: true, data: { roomId: roomId, token: token } });
  } catch (err) {
    return next(err);
  }
};
