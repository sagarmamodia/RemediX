export interface CreateConsultationDTO {
  doctorId: string;
  patientId: string;
  paymentId: string;
}

export interface ConsultationDTO {
  id: string;
  doctorId: string;
  patientId: string;
  paymentId: string;
  startTime: string;
  endTime?: string;
  roomUrl?: string;
  roomName?: string;
  status: string;
}
