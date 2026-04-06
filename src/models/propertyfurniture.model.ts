import { pool } from "../config/db.js";
import type {
  createPropertyFurnitureType,
  updatePropertyFurnitureType,
} from "../types/propertyfurniture.types.js";

const PropertyFurniture = {
  async createPropertyFurniture({
    propertyId,
    furnitureName,
    category,
    room,
    purchaseDate,
    furnitureCondition,
    purchasePrice,
    attachments,
    notes,
  }: createPropertyFurnitureType) {
    if (!propertyId) {
      throw new Error("Property ID is required");
    }
    if (!furnitureName) {
      throw new Error("Furniture name is required");
    }
    if (!furnitureCondition) {
      throw new Error("Furniture condition is required");
    }

    const { rows } = await pool.query(
      `INSERT INTO property_furniture (property_id, furniture_name, category, room, purchase_date, furniture_condition, purchase_price, attachments, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        propertyId,
        furnitureName,
        category,
        room,
        purchaseDate,
        furnitureCondition,
        purchasePrice,
        attachments,
        notes,
      ],
    );

    return rows[0];
  },
  async listPropertyFurniture({ propertyId }: { propertyId: string }) {
    if (!propertyId) {
      throw new Error("Property ID is required");
    }

    const { rows } = await pool.query(
      `SELECT * FROM property_furniture WHERE property_id = $1`,
      [propertyId],
    );

    return rows;
  },
  async updatePropertyFurniture({
    propertyId,
    furnitureName,
    category,
    room,
    purchaseDate,
    furnitureCondition,
    purchasePrice,
    attachments,
    notes,
  }: updatePropertyFurnitureType) {
    if (!propertyId) {
      throw new Error("Property ID is required");
    }
    if (!furnitureName) {
      throw new Error("Furniture name is required");
    }
    if (!furnitureCondition) {
      throw new Error("Furniture condition is required");
    }

    const { rows } = await pool.query(
      `UPDATE property_furniture SET furniture_name = $1, category = $2, room = $3, purchase_date = $4, furniture_condition = $5, purchase_price = $6, attachments = $7, notes = $8 WHERE property_id = $9`,
      [
        furnitureName,
        category,
        room,
        purchaseDate,
        furnitureCondition,
        purchasePrice,
        attachments,
        notes,
        propertyId,
      ],
    );

    return rows[0];
  },
  async deletePropertyFurniture({ propertyId }: { propertyId: string }) {
    if (!propertyId) {
      throw new Error("Property ID is required");
    }

    const { rows } = await pool.query(
      `DELETE FROM property_furniture WHERE property_id = $1`,
      [propertyId],
    );
    return rows[0];
  },
};

export default PropertyFurniture;
