import { Router } from "express";
import * as ProviderController from "../controllers/provider.controller";
import { protect } from "../middleware/auth.middleware";

const providerRoutes = Router();

providerRoutes.get("/list", ProviderController.getProvidersListHandler);
providerRoutes.get(
  "/details/id/:id",
  ProviderController.getProviderDetailsHandler
);
providerRoutes.post(
  "/availability/update",
  protect,
  ProviderController.updateProviderAvailabilityHandler
);

export default providerRoutes;
