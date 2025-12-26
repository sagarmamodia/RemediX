import { Router } from "express";
import multer from "multer";

const consultationRoutes = Router();

const storage = multer.memoryStorage();
export const bufferFileMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") // Allows png, jpeg, jpg, webp, etc.
      //   file.mimetype === "application/pdf" // Allows PDFs
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDF files are allowed!") as any, false);
    }
  },
});
