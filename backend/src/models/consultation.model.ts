import { Schema, model, Document, Types } from "mongoose";

export interface IConsultation extends Document {
    _id: Types.ObjectId,
    providerId: string,
    patientId: string,
    slotId: string,
    status: string
}

const consultationSchema = new Schema<IConsultation>({
    providerId: {type: String, required: true},
    patientId: {type: String, required: true},
    slotId: {type: String},
    status: {type: String, enum: ["pending", "completed"], required: true}
})

export const ConsultationModel = model<IConsultation>('Consultation', consultationSchema);
