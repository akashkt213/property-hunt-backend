import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import PropertyItemDetailsModel from "../models/property_item_details.js";
import type { createPropertyItemDetailsType } from "../types/property_item_details.js";
import type { Response } from "express";


const PropertyItemDetailsController = {
    createPropertyItemDetails: async (req: AuthenticatedRequest & {
        body: createPropertyItemDetailsType;
    }, res: Response) => {
        try {
            const {propertyId, itemName, itemDescription, itemPrice, itemQuantity, itemTotal, itemStatus, itemSource, itemCategory, itemIssue } = req.body;
            const userId = req.user?.id;
            if(!userId){
                return res.status(401).json({ message: "Unauthorized" });
            }
            const propertyItemDetails = await PropertyItemDetailsModel.createPropertyItemDetails({
                propertyId,
                itemName,
                itemDescription,
                itemPrice,
                itemQuantity,
                itemTotal,
                itemStatus,
                itemSource,
                itemCategory,
                itemIssue,
            });
            return res.status(201).json({ message: "Property item details created successfully", propertyItemDetails });
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    updatePropertyItemDetails: async (req: AuthenticatedRequest & {
        body: createPropertyItemDetailsType;
    }, res: Response) => {
        try {
            const {propertyId, itemName, itemDescription, itemPrice, itemQuantity, itemTotal, itemStatus, itemSource, itemCategory, itemIssue } = req.body;
            const userId = req.user?.id;
            if(!userId){
                return res.status(401).json({ message: "Unauthorized" });
            }
            const propertyItemDetails = await PropertyItemDetailsModel.updatePropertyItemDetails({
                propertyId,
                itemName,
                itemDescription,
                itemPrice,
                itemQuantity,
                itemTotal,
                itemStatus,
                itemSource,
                itemCategory,
                itemIssue,
            });
            return res.status(200).json({ message: "Property item details updated successfully", propertyItemDetails });
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    getAllPropertyItemDetails: async (req: AuthenticatedRequest, res: Response) => {
        try {
            const {propertyId} = req.params;
            const userId = req.user?.id;
            if(!userId){
                return res.status(401).json({ message: "Unauthorized" });
            }
            const propertyItemDetails = await PropertyItemDetailsModel.getAllPropertyRecords({
                propertyId: propertyId as string,
            });
            return res.status(200).json({ message: "Property item details fetched successfully", propertyItemDetails });
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    getPropertyItemDetailsById: async (req: AuthenticatedRequest & {
        params: {
            propertyId: string; 
            itemId: string;
        };
    }, res: Response) => {
        try {
            const {propertyId, itemId} = req.params;
            const userId = req.user?.id;
            if(!userId){
                return res.status(401).json({ message: "Unauthorized" });
            }
            const propertyItemDetails = await PropertyItemDetailsModel.getPropertyItemDetailsById({
                propertyId,
                itemId,
            });
            return res.status(200).json({ message: "Property item details fetched successfully", propertyItemDetails });
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    deletePropertyItemDetails: async (req: AuthenticatedRequest & {
        params: {
            propertyId: string;
            itemId: string;
        };
    }, res: Response) => {
        try {
            const {propertyId, itemId} = req.params;
            const userId = req.user?.id;
            if(!userId){
                return res.status(401).json({ message: "Unauthorized" });
            }
            const propertyItemDetails = await PropertyItemDetailsModel.deletePropertyItemDetails({
                propertyId,
                itemId,
            });
            return res.status(200).json({ message: "Property item details deleted successfully", propertyItemDetails });
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default PropertyItemDetailsController;