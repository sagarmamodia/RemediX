import { Router } from "express";
import * as ProfileController from "../controllers/profile.controller";
import { protect } from "../middleware/auth.middleware";

const profileRoutes = Router();

// GET THE PROFILE DETAILS OF THE LOGGED IN USER
profileRoutes.get("/", protect, ProfileController.getProfileHandler);

export default profileRoutes;
