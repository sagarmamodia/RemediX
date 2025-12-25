import { Document, Schema, Types, model } from "mongoose";

export interface IDoctor extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  dob: Date;
  fee: number;
  specialty: string;
  profileUrl: string;
  available: boolean; // Whether doctor is available for new consultation booking or not
}

const doctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  dob: { type: Date, required: true },
  fee: { type: Number, required: true },
  specialty: { type: String, required: true },
  profileUrl: { type: String, required: true },
  available: { type: Boolean, default: false },
});

export const DoctorModel = model<IDoctor>("Doctor", doctorSchema);
