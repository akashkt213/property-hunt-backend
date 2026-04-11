import { pool } from "../config/db.js";
import type { createPropertyItemDetailsType } from "../types/property_item_details.js";

const PropertyItemDetailsModel = {
  async createPropertyItemDetails({
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
  }: createPropertyItemDetailsType) {
    if (
      !propertyId ||
      !itemName ||
      !itemDescription ||
      !itemPrice ||
      !itemQuantity ||
      !itemTotal ||
      !itemStatus ||
      !itemSource ||
      !itemCategory ||
      !itemIssue
    ) {
      throw new Error("All fields are required");
    }
    const { rows } = await pool.query(
      "INSERT INTO property_item_details (property_id, item_name, item_description, item_price, item_quantity, item_total, item_status, item_source, item_category, item_issue) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING property_id, item_name, item_description, item_price, item_quantity, item_total, item_status, item_source, item_category, item_issue",
      [
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
      ],
    );
    return rows[0];
  },
  async updatePropertyItemDetails({
    itemName,
    itemDescription,
    itemPrice,
    itemQuantity,
    itemTotal,
    itemStatus,
    itemSource,
    itemCategory,
    itemIssue,
  }: createPropertyItemDetailsType) {
    if (
      !itemName ||
      !itemDescription ||
      !itemPrice ||
      !itemQuantity ||
      !itemTotal ||
      !itemStatus ||
      !itemSource ||
      !itemCategory ||
      !itemIssue
    ) {
      throw new Error("All fields are required");
    }

    const { rows } = await pool.query(
      "INSERT INTO property_item_details (itemName,itemDescription,itemPrice,itemQuantity,itemTotal,itemStatus,itemSource,itemCategory,itemIssue) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING item_name, item_description, item_price, item_quantity, item_total, item_status, item_source, item_category, item_issue",
      [
        itemName,
        itemDescription,
        itemPrice,
        itemQuantity,
        itemTotal,
        itemStatus,
        itemSource,
        itemCategory,
        itemIssue,
      ],
    );
    return rows[0];
  },
  async getAllPropertyRecords({ propertyId }: { propertyId: string }) {
    if (!propertyId) {
      throw new Error("Propery id is required");
    }

    const { rows } = await pool.query(
      "SELECT  * FROM property_item_details WHERE property_id = $1",
      [propertyId],
    );
    return rows;
  },
  async getPropertyItemDetailsById({
    propertyId,
    itemId,
  }: {
    propertyId: string;
    itemId: string;
  }) {
    if (!propertyId || !itemId) {
      throw new Error("Property id and item id are required");
    }

    const { rows } = await pool.query(
      "SELECT * FROM property_item_details WHERE property_id = $1 AND id = $2",
      [propertyId, itemId],
    );
    return rows[0];
  },
  async deletePropertyItemDetails({
    propertyId,
    itemId,
  }: {
    propertyId: string;
    itemId: string;
  }) {
    if (!propertyId || !itemId) {
      throw new Error("Property id and item id are required");
    }
  },
};


export default PropertyItemDetailsModel;