import { pool } from "../../db";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import config from "../../config";

const loginUserToDB = async(payload:{email:string,password:string})=>{
const {email,password} = payload
// does user exist
const user = await pool.query(`
    SELECT * FROM users WHERE email = $1
    
    `,[email])
    
    if(user.rowCount === 0){
        throw new Error("User not exist")
    }
    //check the password
    const isPasswordValid = await bcrypt.compare(password,user.rows[0].password)
    if(!isPasswordValid){
        throw new Error("Invalid Credential!!")
    }

    if(!user.rows[0].is_active){
        throw new Error("User is Blocked")
    }
    //create jwt access token
    const jwtPayload={
        id:user.rows[0].id,
        email:user.rows[0].email,
        roll:user.rows[0].roll,
        name:user.rows[0].name
    }
    const accessToken = jwt.sign(jwtPayload,config.jwt_secret as string,{expiresIn:"1d"})
    
delete user.rows[0].password
return {accessToken,user:user.rows[0]}

}

export const authService = {
    loginUserToDB
}