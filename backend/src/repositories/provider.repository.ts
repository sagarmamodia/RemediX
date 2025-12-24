import { ProviderDTO } from "../dtos/provider.dto";
import { IProvider, ProviderModel } from "../models/provider.model";
import logger from "../utils/logger";
import { CreateProviderDTO } from "../validators/provider.validator";
import { ProviderFilterQueryDTO } from "../validators/providerFilter.validator";

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
    available: provider.available,
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

export const getProvidersList = async (
  filter: ProviderFilterQueryDTO
): Promise<ProviderDTO[]> => {
  const { speciality, fee, name } = filter;
  const queryFilter: any = {};
  if (speciality) {
    queryFilter.speciality = speciality;
  }
  if (fee) {
    queryFilter.fee = { $gte: fee[0], $lte: fee[1] };
  }
  if (name) {
    queryFilter.name = { $regex: name, $options: "i" };
  }

  logger.info("query filter created");
  const providers: IProvider[] = await ProviderModel.find(queryFilter);
  logger.info("providers retrieved from db");

  const providersAsDTO: ProviderDTO[] = [];
  providers.forEach((provider) => {
    providersAsDTO.push(toProviderDTO(provider));
  });
  logger.info("providers converted to DTOs");

  return providersAsDTO;
};

export const getProviderFee = async (id: string): Promise<number | null> => {
  const provider = await ProviderModel.findById(id);
  if (!provider) return null;
  else return provider.fee;
};

export const updateProviderAvailability = async (
  id: string,
  availability: boolean
) => {
  await ProviderModel.findByIdAndUpdate(
    id,
    { available: availability },
    { new: false, runValidators: true }
  ).exec();
  logger.info("provider availability changed}");
};
