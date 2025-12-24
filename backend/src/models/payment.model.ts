import { Schema, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
    _id: Types.ObjectId,
    amount: number,
    consultationId: string,
    createdAt: Date
}

const paymentSchema = new Schema<IPayment>({
    amount: {type: Number, required: true},
    consultationId: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
})

export const PaymentModel = model<IPayment>('Payment', paymentSchema);
