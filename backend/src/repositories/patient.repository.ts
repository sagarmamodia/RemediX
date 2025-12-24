import { PatientDTO } from "../dtos/patient.dto";
import { IPatient, PatientModel } from "../models/patient.model";
import { CreatePatientDTO } from "../validators/patient.validator";

// =================== IPatient to dtoPatient Mapper ================================
function toDtoPatient(patient: IPatient): PatientDTO {
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

// =====================================================================================

export const getPatientById = async (
  id: string
): Promise<PatientDTO | null> => {
  // Mongoose automatically converts id to ObjectId
  // If id is of invalid format it will throw an error

  const patient: IPatient | null = await PatientModel.findById(id);
  if (!patient) return null;
  else return toDtoPatient(patient);
};

export const registerPatient = async (
  data: CreatePatientDTO
): Promise<string> => {
  const doc = new PatientModel(data);
  const createdDoc = await doc.save();
  return createdDoc._id.toHexString();
};

export const getPatientByPhoneWithPassword = async (
  phone: string
): Promise<{ id: string; password: string } | null> => {
  const patient: IPatient | null = await PatientModel.findOne({ phone: phone });
  if (!patient) return null;
  return { id: patient._id.toHexString(), password: patient.password };
};
