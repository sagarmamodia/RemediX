import {
  ConsultationDTO,
  CreateConsultationDTO,
} from "../dtos/consultation.dto";
import { ConsultationModel, IConsultation } from "../models/consultation.model";
import logger from "../utils/logger";

// ================== Convert IConsultation to ConsultationDTO =======================
function toConsultationDTO(consultation: IConsultation): ConsultationDTO {
  return {
    id: consultation._id.toHexString(),
    providerId: consultation.providerId,
    patientId: consultation.patientId,
    paymentId: consultation.paymentId,
    startTime: consultation.startTime.toISOString(),
    roomUrl: consultation.roomUrl,
    endTime: consultation.endTime
      ? consultation.endTime.toISOString()
      : undefined,
    status: consultation.status,
  };
}

export const getAllConsultationsByProviderId = async (
  id: string
): Promise<ConsultationDTO[]> => {
  const consultations = await ConsultationModel.find({ providerId: id });
  const consultationDtos: ConsultationDTO[] = [];
  consultations.forEach((consultation) => {
    consultationDtos.push(toConsultationDTO(consultation));
  });

  return consultationDtos;
};

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

export const createConsultationRecord = async (
  data: CreateConsultationDTO
): Promise<string> => {
  const doc = new ConsultationModel(data);
  const createdDoc = await doc.save();
  return createdDoc._id.toHexString();
};

export const getConsultationById = async (
  id: string
): Promise<ConsultationDTO | null> => {
  const consultation = await ConsultationModel.findById(id);
  if (!consultation) return null;
  return toConsultationDTO(consultation);
};

export const getPendingConsultationsByProviderId = async (
  id: string
): Promise<ConsultationDTO[]> => {
  const queryFilter = { providerId: id, status: "pending" };
  const docs = await ConsultationModel.find(queryFilter);
  logger.info("pending consultations fetched from database");

  const consultationDtos: ConsultationDTO[] = [];
  docs.forEach((doc) => {
    consultationDtos.push(toConsultationDTO(doc));
  });

  return consultationDtos;
};

export const nextConsultationStartTimeByProviderId = async (
  id: string
): Promise<Date | null> => {
  const queryFilter = { providerId: id, startTime: { $gte: new Date() } };
  const docs = await ConsultationModel.find(queryFilter).sort({ startTime: 1 });
  logger.info("upcoming consultations fetched from database");

  if (docs.length == 0) return null;
  const mostRecentDoc = docs[0];

  return mostRecentDoc.startTime;
};

export const updateConsultationStatus = async (id: string, status: string) => {
  await ConsultationModel.findByIdAndUpdate(id, { status: status });
};

export const updateRoomUrl = async (id: string, roomUrl: string) => {
  await ConsultationModel.findByIdAndUpdate(id, { roomUrl: roomUrl });
};
