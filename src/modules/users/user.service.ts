import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs";
const createUserIntoDB = async(payload:IUser)=>{
     const { name, email, password, age } = payload;
    const hashPassword = await bcrypt.hash(password,10)
    const result = await pool.query(
      `
  INSERT INTO users (name,email,password,age) VALUES
  ($1,$2,$3,$4) RETURNING name,email,age
    `,
      [name, email, hashPassword, age],
    );
    return result
}
const getAllUsersFromDB = async ()=>{
      const result = await pool.query(`
        SELECT * FROM users
        `);
        return result
}
const getSingleUserFromDB = async (id:string)=>{
     const result = await pool.query(
      `
        SELECT * FROM users WHERE id = $1
        `,
      [id],
    );
    return result
}
const updateUserFromDB = async (id:string,payload:Partial<IUser>)=>{
    const { name, email, age, password } = payload;
     const result = await pool.query(
      `
    UPDATE users
    SET 
    name = COALESCE($1,name),
    email = COALESCE($2,email),
    age = COALESCE($3,age),
    password = COALESCE($4,password),
    updated_at = NOW()
    WHERE id = $5
    RETURNING *
    `,
      [name ?? null, email ?? null, age ?? null, password ?? null, id],
    );
    return result
}
const deleteUserFromDB = async (id:string)=>{
      const result = await pool.query(
      `
  DELETE FROM users WHERE id = $1
  `,
      [id],
    );
    return result
}
export const userService ={
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserFromDB,
    deleteUserFromDB
}