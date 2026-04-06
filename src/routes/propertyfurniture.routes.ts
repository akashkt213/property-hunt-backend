import { Router } from "express";
import PropertyFurnitureController from "../controller/propertyfurniture.controller.js";
import requireAuth from "../middlewares/auth.middleware.js";

const propertyFurnitureRoutes = Router();

propertyFurnitureRoutes.post(
  "/",
  requireAuth,
  PropertyFurnitureController.createPropertyFurniture,
);
propertyFurnitureRoutes.get(
  "/:propertyId",
  requireAuth,
  PropertyFurnitureController.listPropertyFurniture,
);
propertyFurnitureRoutes.put(
  "/:propertyId",
  requireAuth,
  PropertyFurnitureController.updatePropertyFurniture,
);
propertyFurnitureRoutes.delete(
  "/:propertyId",
  requireAuth,
  PropertyFurnitureController.deletePropertyFurniture,
);

export default propertyFurnitureRoutes;