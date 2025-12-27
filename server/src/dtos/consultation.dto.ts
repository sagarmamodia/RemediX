export interface CreateConsultationDTO {
  doctorId: string;
  patientId: string;
  paymentId: string;
  startTime: Date;
  symptoms: string;
  endTime: Date;
  fee: number;
}

export interface ConsultationDTO {
  id: string;
  doctorId: string;
  patientId: string;
  paymentId: string;
  startTime: string;
  endTime: string;
  symptoms: string;
  roomId?: string;
  prescriptionUrl?: string;
  fee: number;
  status: string;
}

export interface DoctorConsultationsDTO {
  id: string;
  patientName: string;
  patientProfileUrl: string;
  prescriptionUrl?: string;
  symptoms: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface PatientConsultationsDTO {
  id: string;
  doctorName: string;
  doctorProfileUrl: string;
  doctorSpecialty: string;
  symptoms: string;
  prescriptionUrl?: string;
  startTime: string;
  endTime: string;
  status: string;
}
