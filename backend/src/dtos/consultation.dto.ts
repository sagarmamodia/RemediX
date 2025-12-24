export interface CreateConsultationDTO {
  providerId: string;
  patientId: string;
  paymentId: string;
}

export interface ConsultationDTO {
  id: string;
  providerId: string;
  patientId: string;
  paymentId: string;
  startTime: string;
  status: string;
}
