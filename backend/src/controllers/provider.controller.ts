import { NextFunction, Request, Response } from "express";
import * as ProviderRepository from "../repositories/provider.repository";
import { AppError } from "../utils/AppError";
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
