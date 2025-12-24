import { Schema, model, Document, Types } from "mongoose";

export interface IChat extends Document {
    _id: Types.ObjectId,
    consultationId: string,
    sender: string,
    receiver: string,
    messageType: string,
    message: string,
    createdAt: Date
}

const chatSchema = new Schema<IChat>({
    consultationId: {type: String, required: true},
    sender: {type: String, enum: ["provider", "patient"], required: true},
    receiver: {type: String, enum: ["provider", "patient"], required: true},
    messageType: {type: String, enum: ["text", "image"], required: true},
    message: {type: String},
    createdAt: {type: Date, default: Date.now()}
})

export const ChatModel = model<IChat>('Consultation', chatSchema);
