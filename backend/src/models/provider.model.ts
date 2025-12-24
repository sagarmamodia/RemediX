import {Schema, model, Document, Types} from "mongoose";

interface IProvider extends Document {
    _id: Types.ObjectId
    name: string 
    email: string
    phone: string 
    gender: string 
    dob: Date 
    speciality: string
    profileUrl: string  
    onShift: boolean // Whether doctor current is on the shift or not
}

const providerSchema = new Schema<IProvider>({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    gender: {type: String, enum: ["Male", "Female"]},
    dob: {type: Date, required: true},
    speciality: {type: String, required: true},
    profileUrl: {type: String, required: true},
    onShift: {type: Boolean, default: false}
})

export const ProviderModel = model<IProvider>('Provider', providerSchema)