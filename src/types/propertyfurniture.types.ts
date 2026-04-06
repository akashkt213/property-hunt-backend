export type furnitureConditionType = 'NEW' | 'GOOD' | 'FAIR' | 'POOR';
export type createPropertyFurnitureType = {
    propertyId: string;
    furnitureName: string;
    category: string;
    room: string;
    purchaseDate: string;
    furnitureCondition: furnitureConditionType;
    purchasePrice: number;
    attachments: string[];
    notes: string;
}

export type updatePropertyFurnitureType = {
    propertyId: string;
    furnitureName: string;
    category: string;
    room: string;
    purchaseDate: string;
    furnitureCondition: furnitureConditionType;
    purchasePrice: number;
    attachments: string[];
    notes: string;
}