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
  async findByEmail({email}:{email:string}){
    const {rows} = await pool.query(`SELECT id, email, full_name, role FROM users WHERE email = $1 and deleted_at IS NULL`,[email])
    return rows[0] || null;
  },
  async createUser({ email, password, full_name, role }: createUserType) {
    const password_hash =await bcrypt.hash(password, SALT_ROUNDS);
    console.log("password_hash",password_hash)
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role, email_verified, created_at`,
      [email.toLowerCase(), password_hash, full_name, role],
    );

    return rows[0];
  },

  async updateUser({id,full_name}:{id:string,full_name:string}){
    const { rows }= await pool.query(`UPDATE users SET full_name = $1 WHERE id = $2 AND deleted_at IS NULL`,[full_name,id]) 
    return rows[0];
  },
  async deleteUser({id}:{id:string}){
    const {rows} = await pool.query(`UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`,[id])
    return rows[0];
  },
  async signIn({email, password}:{email:string, password:string}){
    const hashedPassword = bcrypt.hash(password, SALT_ROUNDS)
    const { rows} = await pool.query(`SELECT id, email, full_name, role FROM users WHERE email = $1 and password_hash = $2 and deleted_at IS NULL`,[email, hashedPassword])

    if(rows.length == 0){
      throw new Error("Invalid email or password");
    }

    const user = rows[0]

    return user;
  }
};


export default UserModel;