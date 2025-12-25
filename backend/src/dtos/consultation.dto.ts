export interface CreateConsultationDTO {
  doctorId: string;
  patientId: string;
  paymentId: string;
  startTime: Date;
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
  roomId?: string;
  fee: number;
  status: string;
}

export interface DoctorConsultationsDTO {
  id: string;
  patientName: string;
  patientProfileUrl: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface PatientConsultationsDTO {
  id: string;
  doctorName: string;
  doctorProfileUrl: string;
  doctorSpecialty: string;
  startTime: string;
  endTime: string;
  status: string;
}
