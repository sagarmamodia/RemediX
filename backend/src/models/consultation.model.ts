import { Document, Schema, Types, model } from "mongoose";

export interface IConsultation extends Document {
  _id: Types.ObjectId;
  providerId: string;
  patientId: string;
  paymentId: string;
  startTime: Date;
  endTime: Date | null;
  status: string;
}

const consultationSchema = new Schema<IConsultation>({
  providerId: { type: String, required: true },
  patientId: { type: String, required: true },
  startTime: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000),
  }, // after 5 minutes from the current time
  endTime: {
    type: Date,
    required: false,
  },
  paymentId: {
    type: String,
    required: true,
  },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
});

export const ConsultationModel = model<IConsultation>(
  "Consultation",
  consultationSchema
);
