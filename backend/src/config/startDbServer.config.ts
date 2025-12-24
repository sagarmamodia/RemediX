import mongoose from "mongoose";
import { config } from "./index.config.js";


const mongoUri = config.mongo.uri;
export async function connectDb(){
    let connected = false;
    while(!connected){
        try{
            await mongoose.connect(mongoUri);
            console.log("✅ MongoDB connected successfully");
            connected=true;
        }
        catch(err){
            console.error(err);
            throw new Error("Internal Server Error");
        }
    }
}