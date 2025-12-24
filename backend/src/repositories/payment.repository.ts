import { PaymentModel } from "../models/payment.model";
import logger from "../utils/logger";

export const createPaymentRecord = async (
  squarePaymentId: string,
  amount: number
): Promise<string> => {
  const doc = new PaymentModel({
    squarePaymentId: squarePaymentId,
    amount: amount,
  });

  const createdDoc = await doc.save();
  logger.info("payment doc saved");

  return createdDoc._id.toHexString();
};
