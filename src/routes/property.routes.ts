import { Router } from "express";
import PropertyController from "../controller/property.controller.js";
import requireAuth from "../middlewares/auth.middleware.js";

const propertyRoutes = Router();

propertyRoutes.post("/", requireAuth, PropertyController.createProperty);
propertyRoutes.get("/:userId", requireAuth, PropertyController.listProperty);
propertyRoutes.put("/:userId", requireAuth, PropertyController.updateProperty);
propertyRoutes.delete(
  "/:propertyId",
  requireAuth,
  PropertyController.deleteProperty,
);

export default propertyRoutes;
