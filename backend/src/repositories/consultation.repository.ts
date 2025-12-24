import {
  ConsultationDTO,
  CreateConsultationDTO,
} from "../dtos/consultation.dto";
import { ConsultationModel, IConsultation } from "../models/consultation.model";

// ================== Convert IConsultation to ConsultationDTO =======================
function toConsultationDTO(consultation: IConsultation): ConsultationDTO {
  return {
    id: consultation._id.toHexString(),
    providerId: consultation.providerId,
    patientId: consultation.patientId,
    paymentId: consultation.paymentId,
    startTime: consultation.startTime.toISOString(),
    status: consultation.status,
  };
}

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
