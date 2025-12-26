import { DoctorDTO } from "../dtos/doctor.dto";
import { DoctorModel, IDoctor } from "../models/doctor.model";
import {
  CreateDoctorDTO,
  UpdateDoctorDTO,
} from "../validators/doctor.validator";
import { DoctorFilterQueryDTO } from "../validators/doctorFilter.validator";

// =================== HELPER FUNCTIONS ================================
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
    shifts: doctor.shifts,
  };
}

// ======================================================================

// RETURN A DOCTOR MATCHING THE GIVENID
export const getDoctorById = async (id: string): Promise<DoctorDTO | null> => {
  const patient: IDoctor | null = await DoctorModel.findById(id);
  if (!patient) return null;
  else return toDoctorDTO(patient);
};

// CREATE A NEW DOCTOR IN DB
export const registerDoctor = async (
  data: CreateDoctorDTO
): Promise<string> => {
  const doc = new DoctorModel(data);

  // add default shifts
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  for (const day of days) {
    doc.shifts.push({
      // morning shift
      dayOfWeek: day,
      startTime: 9 * 60,
      endTime: 13 * 60,
      slotDuration: 30,
    });
    // evening shift
    doc.shifts.push({
      dayOfWeek: day,
      startTime: 14 * 60,
      endTime: 18 * 60,
      slotDuration: 30,
    });
  }

  // save doc to db
  const createdDoc = await doc.save();

  return createdDoc._id.toHexString();
};

// RETURN THE DOCTORID AND PASSWORD OF THE DOCTOR MATCHING A PHONE NUMBER (UNIQUE)
export const getDoctorByPhoneWithPassword = async (
  phone: string
): Promise<{ id: string; password: string } | null> => {
  const doctor: IDoctor | null = await DoctorModel.findOne({
    phone: phone,
  });
  if (!doctor) return null;
  return { id: doctor._id.toHexString(), password: doctor.password };
};

// RETURN THE FILTERED LIST OF DOCTOR
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

  const doctors: IDoctor[] = await DoctorModel.find(queryFilter);

  const doctorsAsDTO: DoctorDTO[] = [];
  doctors.forEach((doctor) => {
    doctorsAsDTO.push(toDoctorDTO(doctor));
  });

  return doctorsAsDTO;
};

// RETURN THE FEE OF A DOCTOR MATCHING THE GIVEN ID
export const getDoctorFee = async (id: string): Promise<number | null> => {
  const doctor = await DoctorModel.findById(id);
  if (!doctor) return null;
  else return doctor.fee;
};

// UPDATE A DOCTOR'S AVAILABLE FIELD
export const updateDoctorAvailability = async (
  id: string,
  availability: boolean
) => {
  await DoctorModel.findByIdAndUpdate(
    id,
    { available: availability },
    { new: false, runValidators: true }
  ).exec();
};

// UPDATE DOCTOR
// UPDATE PATIENT PROFILE
export const updateDoctor = async (
  id: string,
  updates: { profileUrl?: string; otherData: UpdateDoctorDTO }
): Promise<DoctorDTO | null> => {
  const updatedData: any = { ...updates.otherData };
  if (updates.profileUrl) updatedData.profileUrl = updates.profileUrl;
  const newDoc = await DoctorModel.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!newDoc) return null;
  return toDoctorDTO(newDoc);
};

// RETURN ALL DOCTORS MATCHING A SPECIALTY AND AVAILABLE FOR THE GIVEN SLOT (USES LOOKUP IN CONSULTATION COLLECTION AS WELL)
export const getAvailableDoctors = async (
  specialty: string,
  day: string,
  startTime: Date,
  endTime: Date
): Promise<DoctorDTO[]> => {
  // Convert Date objects to Minuts Since Midnight
  const givenStartTimeMins = startTime.getHours() * 60 + startTime.getMinutes();
  const givenEndTimeMins = endTime.getHours() * 60 + endTime.getMinutes();

  // Aggregation Pipeline to find doctors:
  // 1. Match doctors who shift covers the slot completely
  // 2. Ensure they are marked as 'available'.
  // 3. Ensure no overlapping consultations exist for that specific time.

  const availableDoctors = await DoctorModel.aggregate([
    // Match Step: Find doctors on shift using numeric comparison
    {
      $match: {
        available: true, // Only doctors accepting new bookings
        specialty: specialty,
        shifts: {
          $elemMatch: {
            dayOfWeek: day,
            startTime: { $lte: givenStartTimeMins },
            endTime: { $gte: givenEndTimeMins },
          },
        },
      },
    },
    // Lookup Step: Check for existing consultations in the same time range
    {
      $lookup: {
        from: "consultations",
        let: { doctorId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$doctorId", { $toString: "$$doctorId" }] },
                  { $ne: ["$status", "COMPLETED"] },
                  { $lt: ["$startTime", endTime] }, // Overlap check
                  { $gt: ["$endTime", startTime] }, // Overlap check
                ],
              },
            },
          },
        ],
        as: "overlappingConsultations",
      },
    },
    // Filter Step: Keep only those with no overlaps
    {
      $match: {
        overlappingConsultations: { $size: 0 },
      },
    },
    // Cleanup results
    {
      $project: {
        overlappingConsultations: 0,
      },
    },
  ]);

  const dtos: DoctorDTO[] = [];
  for (const doctor of availableDoctors) {
    dtos.push(toDoctorDTO(doctor));
  }

  return dtos;
};
