import { NextFunction, Request, Response } from "express";
import * as ProviderController from "../repositories/provider.repository";
import { AppError } from "../utils/AppError";
import { ProviderFilterQuerySchema } from "../validators/providerFilter.validator";

export const getProviderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (err) {
    return next(err);
  }
};

export const getProvidersList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = ProviderFilterQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError("Invalid query params", 400);
    }

    const providers = await ProviderController.getProvidersList(parsed.data);

    return res.status(200).json({ success: true, data: { list: providers } });
  } catch (err) {
    return next(err);
  }
};
