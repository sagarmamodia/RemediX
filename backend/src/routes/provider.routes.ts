import { Router } from "express";
import * as ProviderController from "../controllers/provider.controller";

const providerRoutes = Router();

providerRoutes.get("/list", ProviderController.getProvidersListHandler);
providerRoutes.get(
  "/details/id/:id",
  ProviderController.getProviderDetailsHandler
);

export default providerRoutes;
