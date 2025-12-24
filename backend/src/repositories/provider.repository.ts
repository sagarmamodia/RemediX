import { ProviderDTO } from "../dtos/provider.dto";
import { IProvider, ProviderModel } from "../models/provider.model";
import logger from "../utils/logger";
import { CreateProviderDTO } from "../validators/provider.validator";

// =================== IPatient to toProviderDTO Mapper ================================
function toProviderDTO(provider: IProvider): ProviderDTO {
  return {
    id: provider._id.toHexString(),
    name: provider.name,
    email: provider.email,
    phone: provider.phone,
    gender: provider.gender,
    dob: provider.dob.toISOString(),
    fee: provider.fee,
    speciality: provider.speciality,
    profileUrl: provider.profileUrl,
  };
}

// =====================================================================================

export const getProviderById = async (
  id: string
): Promise<ProviderDTO | null> => {
  // Mongoose automatically converts id to ObjectId
  // If id is of invalid format it will throw an error

  const patient: IProvider | null = await ProviderModel.findById(id);
  if (!patient) return null;
  else return toProviderDTO(patient);
};

export const registerProvider = async (
  data: CreateProviderDTO
): Promise<string> => {
  const doc = new ProviderModel(data);
  const createdDoc = await doc.save();

  logger.info("[ProviderRepository][registerProvider] Provider Registered.");
  return createdDoc._id.toHexString();
};

export const getProviderByPhoneWithPassword = async (
  phone: string
): Promise<{ id: string; password: string } | null> => {
  const provider: IProvider | null = await ProviderModel.findOne({
    phone: phone,
  });
  if (!provider) return null;
  return { id: provider._id.toHexString(), password: provider.password };
};
