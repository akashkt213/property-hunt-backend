import type { Request, Response } from "express";
import PropertyFurnitureModel from "../models/propertyfurniture.model.js";
import type { updatePropertyFurnitureType } from "../types/propertyfurniture.types.js";

const PropertyFurnitureController = {
    createPropertyFurniture: async(req:Request, res:Response) =>{
        try {
            const {propertyId, furnitureName, category, room, purchaseDate, furnitureCondition, purchasePrice, attachments, notes} = req.body;
            const propertyFurniture = await PropertyFurnitureModel.createPropertyFurniture({propertyId, furnitureName, category, room, purchaseDate, furnitureCondition, purchasePrice, attachments, notes});
        return res
            .status(201)
            .json({ message: "Property furniture created successfully", propertyFurniture });
        } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
        }
    },
    listPropertyFurniture: async(req:Request, res:Response) =>{
        try {
            const {propertyId} = req.params;
            const propertyFurniture = await PropertyFurnitureModel.listPropertyFurniture({propertyId: propertyId as string});
            return res.status(200).json({message: "Property furniture listed successfully", propertyFurniture});
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    },  
    updatePropertyFurniture: async (
        req: Request<{ propertyId: string }, {}, Omit<updatePropertyFurnitureType, "propertyId">>,
        res: Response,
    ) => {
        try {
            const { propertyId } = req.params;
            const {
                furnitureName,
                category,
                room,
                purchaseDate,
                furnitureCondition,
                purchasePrice,
                attachments,
                notes,
            } = req.body ?? {};

            const propertyFurniture =
                await PropertyFurnitureModel.updatePropertyFurniture({
                    propertyId: propertyId as string,
                    furnitureName,
                    category,
                    room,
                    purchaseDate,
                    furnitureCondition,
                    purchasePrice,
                    attachments,
                    notes,
                });

            return res.status(200).json({
                message: "Property furniture updated successfully",
                propertyFurniture,
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    deletePropertyFurniture: async(req:Request, res:Response) =>{
        try {
            const {propertyId} = req.params;
            const propertyFurniture = await PropertyFurnitureModel.deletePropertyFurniture({propertyId: propertyId as string});
            return res.status(200).json({message: "Property furniture deleted successfully", propertyFurniture});
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

export default PropertyFurnitureController;