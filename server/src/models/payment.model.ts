import { Document, Schema, Types, model } from "mongoose";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  squarePaymentId: string;
  amount: number;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  squarePaymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const PaymentModel = model<IPayment>("Payment", paymentSchema);
