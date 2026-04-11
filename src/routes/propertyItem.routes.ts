import { Router } from "express";
import PropertyItemDetailsController from "../controller/propertyItemDetails.controller.js";

const propertyItemRoutes = Router();

propertyItemRoutes.post("/", PropertyItemDetailsController.createPropertyItemDetails);
propertyItemRoutes.put("/:id", PropertyItemDetailsController.updatePropertyItemDetails);
propertyItemRoutes.get("/", PropertyItemDetailsController.getAllPropertyItemDetails);
propertyItemRoutes.get("/:id", PropertyItemDetailsController.getPropertyItemDetailsById);
propertyItemRoutes.delete("/:id", PropertyItemDetailsController.deletePropertyItemDetails);

export default propertyItemRoutes;