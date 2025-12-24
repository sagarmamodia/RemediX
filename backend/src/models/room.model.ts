import { Schema, model, Document, Types, DateExpression } from "mongoose";

export interface IRoom extends Document {
    _id: Types.ObjectId,
    consultationId: string,
    roomUrl: string,
    createdAt: Date
}

const roomSchema = new Schema<IRoom>({
    consultationId: {type: String, required: true},
    roomUrl: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()}
})

export const RoomModel = model<IRoom>('Room', roomSchema);
