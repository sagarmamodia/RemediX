export interface ShiftDTO {
  dayOfWeek: string;
  startTime: number; // minutes since midnight
  endTime: number; // minutes since midnight
  slotDuration: number; // in minutes
}

export interface DoctorDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  fee: number;
  specialty: string;
  available: boolean;
  profileUrl: string;
  shifts: ShiftDTO[];
}
