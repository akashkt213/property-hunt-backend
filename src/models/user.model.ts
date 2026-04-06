import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import type { createUserType } from "../types/user.types.js";

const SALT_ROUNDS = 12;

const UserModel = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT id, email, full_name, role FROM users ORDER BY created_at DESC`,
    );

    return rows;
  },
  async findById({ id }: { id: string }) {
    const { rows } = await pool.query(
      `SELECT id, email, full_name, role FROM users WHERE id = $1 and deleted_at IS NULL`,
      [id],
    );

    return rows[0] || null;
  },
  async findByEmail({ email }: { email: string }) {
    const { rows } = await pool.query(
      `SELECT id, email, full_name, role, email_verified, password_hash FROM users WHERE email = $1 and deleted_at IS NULL`,
      [email.toLowerCase()],
    );
    return rows[0] || null;
  },
  async createUser({ email, password, full_name, role }: createUserType) {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    console.log('reachable here 6',password_hash)

    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role,email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, role, email_verified, created_at`,
      [email.toLowerCase(), password_hash, full_name, role, false],
    );
    console.log('reachable here 7')
    return rows[0];
  },
  async verifyUser({ id }: { id: string }) {
    const { rows } = await pool.query(
      "UPDATE users SET email_verified = true WHERE id = $1 RETURNING id, email, full_name, role, email_verified",
      [id],
    );
    return rows[0] || null;
  },
  async updateUser({ id, full_name }: { id: string; full_name: string }) {
    const { rows } = await pool.query(
      `UPDATE users SET full_name = $1 WHERE id = $2 AND deleted_at IS NULL`,
      [full_name, id],
    );
    return rows[0];
  },
  async deleteUser({ id }: { id: string }) {
    const { rows } = await pool.query(
      `UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );
    return rows[0];
  },
  async signIn({ email, password }: { email: string; password: string }) {
    const user = await this.findByEmail({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      email_verified: user.email_verified,
    };
  },
};


export default UserModel;