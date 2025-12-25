import { DoctorDTO } from "../dtos/doctor.dto";
import { DoctorModel, IDoctor } from "../models/doctor.model";
import logger from "../utils/logger";
import { CreateDoctorDTO } from "../validators/doctor.validator";
import { DoctorFilterQueryDTO } from "../validators/doctorFilter.validator";

// =================== IPatient to toDoctorDTO Mapper ================================
function toDoctorDTO(doctor: IDoctor): DoctorDTO {
  return {
    id: doctor._id.toHexString(),
    name: doctor.name,
    email: doctor.email,
    phone: doctor.phone,
    gender: doctor.gender,
    dob: doctor.dob.toISOString(),
    fee: doctor.fee,
    specialty: doctor.specialty,
    available: doctor.available,
    profileUrl: doctor.profileUrl,
  };
}

// =====================================================================================

export const getDoctorById = async (id: string): Promise<DoctorDTO | null> => {
  // Mongoose automatically converts id to ObjectId
  // If id is of invalid format it will throw an error

  const patient: IDoctor | null = await DoctorModel.findById(id);
  if (!patient) return null;
  else return toDoctorDTO(patient);
};

export const registerDoctor = async (
  data: CreateDoctorDTO
): Promise<string> => {
  const doc = new DoctorModel(data);
  const createdDoc = await doc.save();

  logger.info("[DoctorRepository][registerDoctor] Doctor Registered.");
  return createdDoc._id.toHexString();
};

export const getDoctorByPhoneWithPassword = async (
  phone: string
): Promise<{ id: string; password: string } | null> => {
  const doctor: IDoctor | null = await DoctorModel.findOne({
    phone: phone,
  });
  if (!doctor) return null;
  return { id: doctor._id.toHexString(), password: doctor.password };
};

export const getDoctorsList = async (
  filter: DoctorFilterQueryDTO
): Promise<DoctorDTO[]> => {
  const { specialty, fee, name, available } = filter;
  const queryFilter: any = {};
  if (specialty) {
    queryFilter.specialty = specialty;
  }
  if (fee) {
    queryFilter.fee = { $gte: fee[0], $lte: fee[1] };
  }
  if (name) {
    queryFilter.name = { $regex: name, $options: "i" };
  }
  if (available !== undefined) {
    queryFilter.available = available;
  }

  logger.info("query filter created");
  const doctors: IDoctor[] = await DoctorModel.find(queryFilter);
  logger.info("doctors retrieved from db");

  const doctorsAsDTO: DoctorDTO[] = [];
  doctors.forEach((doctor) => {
    doctorsAsDTO.push(toDoctorDTO(doctor));
  });
  logger.info("doctors converted to DTOs");

  return doctorsAsDTO;
};

export const getDoctorFee = async (id: string): Promise<number | null> => {
  const doctor = await DoctorModel.findById(id);
  if (!doctor) return null;
  else return doctor.fee;
};

export const updateDoctorAvailability = async (
  id: string,
  availability: boolean
) => {
  await DoctorModel.findByIdAndUpdate(
    id,
    { available: availability },
    { new: false, runValidators: true }
  ).exec();
  logger.info("doctor availability changed}");
};
