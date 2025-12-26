import { Document, Schema, Types, model } from "mongoose";

interface IShift {
  dayOfWeek: string;
  startTime: number; // minutes since midnight
  endTime: number; // minutes since midnight
  slotDuration: number; // in minutes
}

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
  shifts: IShift[];
}

const shiftSchema = new Schema<IShift>({
  dayOfWeek: {
    type: String,
    enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    required: true,
  },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  slotDuration: { type: Number, default: 30 },
});

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
  shifts: { type: [shiftSchema], required: true, id: false },
});

export const DoctorModel = model<IDoctor>("Doctor", doctorSchema);
