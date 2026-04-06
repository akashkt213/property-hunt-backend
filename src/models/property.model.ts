import { pool } from "../config/db.js";
import type {
  createPropertyType,
  updatePropertyType,
} from "../types/property.types.js";

const PropertyModel = {
  async createProperty({
    userId,
    propertyName,
    propertyLocation,
    price,
  }: createPropertyType) {
    if (!userId || !propertyName || !propertyLocation || !price) {
      throw new Error("All fields are required");
    }
    const { rows } = await pool.query(
      `INSERT INTO property(user_id, property_name, property_location, price) VALUES ($1, $2, $3, $4) RETURNING user_id,property_name, property_location, price`,
      [userId, propertyName, propertyLocation, price],
    );

    return rows[0];
  },

  async listProperty({ user_id }: { user_id: string }) {
    if (!user_id) {
      throw new Error("User ID is required");
    }
    const { rows } = await pool.query(
      `SELECT id, property_name, property_location, price FROM property WHERE user_id = $1`,
      [user_id],
    );

    return rows;
  },

  async updateProperty({
    userId,
    propertyName,
    propertyLocation,
    price,
  }: updatePropertyType) {
    const { rows } = await pool.query(
      `UPDATE property SET property_name = $1, property_location = $2, price = $3 WHERE user_id = $4 RETURNING *`,
      [propertyName, propertyLocation, price, userId],
    );
    return rows[0];
  },

  async deleteProperty({
    propertyId,
    userId,
  }: {
    propertyId: string;
    userId: string;
  }) {
    const { rowCount } = await pool.query(
      `DELETE FROM property WHERE id = $1 AND user_id = $2`,
      [propertyId, userId],
    );

    if (rowCount === 0) {
      throw new Error("No property found for this user");
    }

    return { message: "Deleted successfully" };
  },
};

export default PropertyModel;
