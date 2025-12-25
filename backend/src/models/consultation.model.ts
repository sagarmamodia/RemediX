import { Document, Schema, Types, model } from "mongoose";

export interface IConsultation extends Document {
  _id: Types.ObjectId;
  doctorId: string;
  patientId: string;
  paymentId: string;
  startTime: Date;
  endTime: Date;
  fee: number;
  roomId: string | undefined;
  status: string;
}

const consultationSchema = new Schema<IConsultation>({
  doctorId: { type: String, required: true },
  patientId: { type: String, required: true },
  startTime: {
    type: Date,
    // default: () => new Date(Date.now() + 5 * 60 * 1000),
    required: true,
  }, // after 5 minutes from the current time
  endTime: {
    type: Date,
    // default: () => new Date(Date.now() + 35 * 60 * 1000),
    required: true,
  },
  fee: { type: Number, required: true },
  roomId: {
    type: String,
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
