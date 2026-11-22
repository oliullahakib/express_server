import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Roll } from "../types";


const auth = (...rolls: Roll[] ) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
          res.status(401).json({ status: false, message: "Unauthorize access!" });
        }
        const decode = jwt.verify(
          token as string,
          config.jwt_secret as string,
        ) as JwtPayload;
    
        const user = await pool.query(
          `
        SELECT * FROM users WHERE email = $1
        
        `,
          [decode.email],
        );
    
        if (user.rowCount === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found!!",
          });
        }
    
        if (!user.rows[0].is_active) {
          return res.status(403).json({
            success: false,
            message: "Forbidden",
          });
        }
      
        if(rolls.length && !rolls.includes(user.rows[0].roll)){
            return res.status(401).json({
            success: false,
            message: "Unauthorize access",
          }); 
        }
        //req{body:{},user:{id:i,email}}
        req.user = decode;
        next();
    } catch (error) {
        next(error)
    }
  };
};

export default auth;
