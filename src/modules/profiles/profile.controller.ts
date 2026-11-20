import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async(req:Request,res:Response)=>{
  try {
   const result = await profileService.createProfileIntoDB(req.body)
    res.status(201).json({
      status: true,
      message: "Create user profile successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
}

export const profileController ={
    createProfile
}