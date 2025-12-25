export type Role = 'Patient' | 'Doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole: Role | null;
  userId: string | null;
  token: string | null;
  login: (token: string, role: Role) => void;
  logout: () => void;
  loading: boolean;
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  profileUrl: string;
  role: 'Patient';
}

export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  fee: number;
  specialty: string;
  profileUrl: string;
  available: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  dob: string;
  fee: string;
  specialty: string;
}

// Consultation Types
export interface BookConsultationPayload {
  doctorId: string;
  sourceId: string;
}

export interface BookConsultationResponse {
  success: boolean;
  data: {
    id: string;
  };
}

export interface JoinConsultationResponse {
  success: boolean;
  data: {
    roomId: string;
    token: string;
  };
}

export interface Consultation {
  _id: string;
  doctor: {
    _id: string;
    name: string;
    specialty: string;
    image: string;
  };
  patient?: {
    name: string;
    image: string;
  };
  date: string;
  timeSlot: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  amount: number;
}

export interface BackendConsultationDTO {
  consultationId: string;
  doctorName?: string;
  patientName?: string;
  doctorProfileUrl?: string;
  patientProfileUrl?: string;
  doctorSpecialty?: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface ConsultationListResponse {
  success: boolean;
  data: {
    list: BackendConsultationDTO[];
  };
}

export interface DoctorListResponse {
  success: boolean;
  data: {
    list: DoctorProfile[];
  };
}
