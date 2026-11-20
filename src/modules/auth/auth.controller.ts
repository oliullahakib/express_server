import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser= async(req:Request,res:Response)=>{
 try {
   const result = await authService.loginUserToDB(req.body)
    res.status(201).json({
      status: true,
      message: "Create user profile successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
}

export const authController ={
    loginUser
}