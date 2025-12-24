import { Document, Schema, Types, model } from "mongoose";

export interface IPatient extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  dob: Date;
  profileUrl: string; // if user uploads no profile picture then a general profile pic url is added as a default
}

const patientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  dob: { type: Date, required: true },
  profileUrl: { type: String, required: true },
});

export const PatientModel = model<IPatient>("Patient", patientSchema);
