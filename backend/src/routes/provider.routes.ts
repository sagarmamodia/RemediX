import { Router } from "express";
import * as ProviderController from "../controllers/provider.controller";

const providerRoutes = Router();

providerRoutes.get("/list", ProviderController.getProvidersList);

export default providerRoutes;
