import { PatientDTO } from "../dtos/patient.dto";
import { IPatient, PatientModel } from "../models/patient.model";
import { CreatePatientDTO } from "../validators/patient.validator";

// =================== HELPER FUNCTIONS ================================
function toPatientDTO(patient: IPatient): PatientDTO {
  return {
    id: patient._id.toHexString(),
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    gender: patient.gender,
    dob: patient.dob.toISOString(),
    profileUrl: patient.profileUrl,
  };
}

// =====================================================================

// RETURN THE PATIENT MATCHING THE GIVEN ID
export const getPatientById = async (
  id: string
): Promise<PatientDTO | null> => {
  const patient: IPatient | null = await PatientModel.findById(id);
  if (!patient) return null;
  else return toPatientDTO(patient);
};

// CREATE A NEW PATIENT IN DB
export const registerPatient = async (
  data: CreatePatientDTO
): Promise<string> => {
  const doc = new PatientModel(data);
  const createdDoc = await doc.save();
  return createdDoc._id.toHexString();
};

// RETURN A PATIENT'S ID AND PASSWORD HAVING THE GIVEN PHONE NUMBER
export const getPatientByPhoneWithPassword = async (
  phone: string
): Promise<{ id: string; password: string } | null> => {
  const patient: IPatient | null = await PatientModel.findOne({ phone: phone });
  if (!patient) return null;
  return { id: patient._id.toHexString(), password: patient.password };
};
