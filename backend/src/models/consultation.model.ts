import { Schema, model, Document, Types } from "mongoose";

export interface IConsultation extends Document {
    _id: Types.ObjectId,
    providerId: String,
    patientId: String,
    slotId: String,
    status: String
}

const consultationSchema = new Schema<IConsultation>({
    providerId: {type: String, required: true},
    patientId: {type: String, required: true},
    slotId: {type: String},
    status: {type: String, enum: ["pending", "completed"], required: true}
})

export const ConsultationModel = model<IConsultation>('Consultation', consultationSchema);
