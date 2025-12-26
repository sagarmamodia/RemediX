import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier"; // Helper to turn buffer into stream
import { config } from "../config/index.config";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export const uploadToCloudinary = (fileBuffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "prescriptions" }, // Optional: organize into folders
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Convert the buffer to a readable stream and pipe it to Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
