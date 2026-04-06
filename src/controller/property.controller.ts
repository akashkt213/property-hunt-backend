import type { Request, Response } from "express";
import PropertyModel from "../models/property.model.js";
import type {
  createPropertyType,
  updatePropertyType,
} from "../types/property.types.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

const PropertyController = {
  createProperty: async (
    req: AuthenticatedRequest & {
      body: Omit<createPropertyType, "userId">;
    },
    res: Response,
  ) => {
    try {
      const { propertyName, propertyLocation, price } = req.body ?? {};
      const userId = req.user?.id;

      if (!userId || !propertyName || !propertyLocation || !price) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const property = await PropertyModel.createProperty({
        userId,
        propertyName,
        propertyLocation,
        price,
      });

      return res
        .status(201)
        .json({ message: "Property created successfully", property });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  listProperty: async (req: Request<{ userId: string }>, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: "User Id is required" });
      }

      const properties = await PropertyModel.listProperty({ user_id: userId });

      return res.status(200).json({ message: "All properties", properties });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  updateProperty: async (
    req: Request<{ userId: string }, {}, Omit<updatePropertyType, "userId">>,
    res: Response,
  ) => {
    try {
      const { userId } = req.params;
      const { propertyName, propertyLocation, price } = req.body;

      const updatedRecords = await PropertyModel.updateProperty({
        userId,
        propertyName,
        propertyLocation,
        price,
      });
      return res.json(updatedRecords);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },
  deleteProperty: async (
    req: AuthenticatedRequest & Request<{ propertyId: string }>,
    res: Response,
  ) => {
    try {
      const { propertyId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!propertyId) {
        return res.status(400).json({ message: "Property id is required" });
      }

      const result = await PropertyModel.deleteProperty({
        propertyId: String(propertyId),
        userId: String(userId),
      });
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes("No property")) {
        return res.status(404).json({ message: error.message });
      }
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
};

export default PropertyController;
