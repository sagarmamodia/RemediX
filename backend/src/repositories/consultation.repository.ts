import {
  ConsultationDTO,
  CreateConsultationDTO,
} from "../dtos/consultation.dto";
import { ConsultationModel, IConsultation } from "../models/consultation.model";
import logger from "../utils/logger";

// ================== HELPER FUNCTIONS =======================
function toConsultationDTO(consultation: IConsultation): ConsultationDTO {
  return {
    id: consultation._id.toHexString(),
    doctorId: consultation.doctorId,
    patientId: consultation.patientId,
    paymentId: consultation.paymentId,
    startTime: consultation.startTime.toISOString(),
    roomId: consultation.roomId,
    endTime: consultation.endTime.toISOString(),
    status: consultation.status,
    fee: consultation.fee,
  };
}

// ===========================================================

// RETURN ALL CONSULTATIONS MATCHING A DOCTORID
export const getAllConsultationsByDoctorId = async (
  id: string
): Promise<ConsultationDTO[]> => {
  const consultations = await ConsultationModel.find({ doctorId: id });
  const consultationDtos: ConsultationDTO[] = [];
  consultations.forEach((consultation) => {
    consultationDtos.push(toConsultationDTO(consultation));
  });

  return consultationDtos;
};

// RETURN ALL CONSULTATIONS MATCHING A PATIENTID
export const getAllConsultationsByPatientId = async (
  id: string
): Promise<ConsultationDTO[]> => {
  const consultations = await ConsultationModel.find({ patientId: id });
  const consultationDtos: ConsultationDTO[] = [];
  consultations.forEach((consultation) => {
    consultationDtos.push(toConsultationDTO(consultation));
  });

  return consultationDtos;
};

// CREATE CONSULTATION IN DB
export const createConsultationRecord = async (
  data: CreateConsultationDTO
): Promise<string> => {
  const doc = new ConsultationModel(data);
  const createdDoc = await doc.save();
  return createdDoc._id.toHexString();
};

// RETURN CONSULTATION MATCHING AN ID
export const getConsultationById = async (
  id: string
): Promise<ConsultationDTO | null> => {
  const consultation = await ConsultationModel.findById(id);
  if (!consultation) return null;
  return toConsultationDTO(consultation);
};

// RETURN ALL CONSULTATIONS HAVING STATUS="pending" AND MATCHING A DOCTORID
export const getPendingConsultationsByDoctorId = async (
  id: string
): Promise<ConsultationDTO[]> => {
  const queryFilter = { doctorId: id, status: "pending" };
  const docs = await ConsultationModel.find(queryFilter);
  logger.info("pending consultations fetched from database");

  const consultationDtos: ConsultationDTO[] = [];
  docs.forEach((doc) => {
    consultationDtos.push(toConsultationDTO(doc));
  });

  return consultationDtos;
};

// RETURN ALL CONSULTATIONS HAVING STATUS="pending" AND MATCHING A PATIENTID
export const getPendingConsultationsByPatientId = async (
  id: string
): Promise<ConsultationDTO[]> => {
  const queryFilter = { patientId: id, status: "pending" };
  const docs = await ConsultationModel.find(queryFilter);
  logger.info("pending consultations fetched from database");

  const consultationDtos: ConsultationDTO[] = [];
  docs.forEach((doc) => {
    consultationDtos.push(toConsultationDTO(doc));
  });

  return consultationDtos;
};

// UPDATE CONSULTATION STATUS IN DB
export const updateConsultationStatus = async (id: string, status: string) => {
  await ConsultationModel.findByIdAndUpdate(id, { status: status });
};

// ADD ROOMID FIELD IN A CONSULTATION THAT MATCHES THE GIVEN ID
export const addRoom = async (id: string, roomId: string) => {
  await ConsultationModel.findByIdAndUpdate(id, {
    roomId: roomId,
  });
};

// REMOVE ROOMID FIELD FROM A CONSULTATION MATCHING THE GIVEN ID
export const deleteRoom = async (id: string) => {
  await ConsultationModel.findByIdAndUpdate(id, {
    $unset: { roomId: 1 },
  });
};

// UPDATE THE STARTTIME AND ENDTIME FIELDS OF A CONSULTATION
export const updateSlot = async (
  id: string,
  startTime: Date,
  endTime: Date
) => {
  await ConsultationModel.findByIdAndUpdate(id, {
    startTime: startTime,
    endTime: endTime,
  });
};
