import { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import squareClient from "../config/square.config";
import { CreateConsultationDTO } from "../dtos/consultation.dto";
import * as ConsultationRepository from "../repositories/consultation.repository";
import * as PaymentRepository from "../repositories/payment.repository";
import * as ProviderRepository from "../repositories/provider.repository";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";
import { BookConsultationSchema } from "../validators/consultation.validator";

export const paymentAndConsultationBookingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (user.role != "Patient") {
      throw new AppError("Only patients can book consultation", 400);
    }

    // parse json payload
    const parsed = BookConsultationSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid data format", 400);
    }

    // retrieve provider's fees
    const fee = await ProviderRepository.getProviderFee(parsed.data.providerId);
    if (!fee) {
      throw new AppError("Provider not found", 400);
    }

    // Charge payment
    const response = await squareClient.paymentsApi.createPayment({
      sourceId: parsed.data.sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(fee),
        currency: "USD",
      },
    });

    if (!response.result.payment || !response.result.payment.id) {
      throw new AppError("Payment failed", 400);
    }
    logger.info("payment charged");

    // record payment in db
    const paymentId = await PaymentRepository.createPaymentRecord(
      response.result.payment.id,
      fee
    );

    logger.info("payment recorded");

    // create consultation
    const data: CreateConsultationDTO = {
      providerId: parsed.data.providerId,
      patientId: user.id,
      paymentId: paymentId,
    };

    logger.info("consultation created");

    const consultationId =
      await ConsultationRepository.createConsultationRecord(data);

    return res
      .status(200)
      .json({ success: true, data: { id: consultationId } });
  } catch (err) {
    return next(err);
  }
};

export const getConsultationByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new AppError("Invalid url parameter", 400);
    }

    const consultation = await ConsultationRepository.getConsultationById(id);
    if (!consultation) {
      throw new AppError("Consultation now found", 400);
    }

    return res.status(200).json({
      success: true,
      data: consultation,
    });
  } catch (err) {
    return next(err);
  }
};
