import { PaymentModel } from "../models/payment.model";

// CREATE THE PAYMENT RECORD IN DB
export const createPaymentRecord = async (
  squarePaymentId: string,
  amount: number
): Promise<string> => {
  const doc = new PaymentModel({
    squarePaymentId: squarePaymentId,
    amount: amount,
  });

  const createdDoc = await doc.save();

  return createdDoc._id.toHexString();
};
