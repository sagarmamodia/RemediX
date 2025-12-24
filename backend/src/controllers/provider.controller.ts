import { NextFunction, Request, Response } from "express";
import * as ConsultationRepository from "../repositories/consultation.repository";
import * as ProviderRepository from "../repositories/provider.repository";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";
import { ProviderFilterQuerySchema } from "../validators/providerFilter.validator";

export const getProviderDetailsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.body must contain the id of the provider
    const id: string = req.params.id;
    if (!id) {
      throw new AppError("Invalid data", 400);
    }

    const provider = await ProviderRepository.getProviderById(id);
    if (!provider) {
      throw new AppError("Provider does not exist", 400);
    }

    return res
      .status(200)
      .json({ success: true, data: { role: "Provider", ...provider } });
  } catch (err) {
    return next(err);
  }
};

export const getProvidersListHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = ProviderFilterQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError("Invalid query params", 400);
    }

    const providers = await ProviderRepository.getProvidersList(parsed.data);

    return res.status(200).json({ success: true, data: { list: providers } });
  } catch (err) {
    return next(err);
  }
};

export const updateProviderAvailabilityHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (user.role != "Provider") {
      return new AppError("Only providers are authorized", 401);
    }

    const data = req.body.available;
    if (!data || (data != "false" && data != "true")) {
      throw new AppError("Invalid data format", 400);
    }
    logger.info("request data parsed");

    // check if provider is allowed to change its availability
    // if provider has a consultation then its availability must be set to false he must not be allowed to change it
    const pendingConsultations =
      await ConsultationRepository.getPendingConsultationsByProviderId(user.id);

    if (pendingConsultations.length > 0) {
      throw new AppError(
        "Provider have a consultation scheduled - availability can't be changed",
        400
      );
    }

    const availability = data == "true" ? true : false;
    await ProviderRepository.updateProviderAvailability(user.id, availability);
    logger.info("request availability updated");
    return res.status(200).json({ success: true, data: {} });

    //
  } catch (err) {
    return next(err);
  }
};
