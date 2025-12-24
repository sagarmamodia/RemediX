export type Role = 'Patient' | 'Provider';

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
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  profileUrl: string;
  role: 'Patient';
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  dob: string;
  fee: string;
  speciality: string;
}
