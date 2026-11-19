import type { Request, Response } from "express";
import { userService } from "./user.service";


const createUser = async (req: Request, res: Response) => {
  try {
   const result = await userService.createUserIntoDB(req.body)
    res.status(201).json({
      status: true,
      message: "Create User Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
}
const getAllUsers = async (req: Request, res: Response) => {
  try {
  const result = await userService.getAllUsersFromDB()
    res.status(200).json({
      status: true,
      message: "Retrive all users",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
}
const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
   const result = await userService.getSingleUserFromDB(id as string)
    if (result.rowCount === 0) {
      res.status(404).json({ status: false, message: "User not found!" });
    }
    res.status(200).json({
      status: true,
      message: "Retrive a single user",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
}
const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
   const result = await userService.updateUserFromDB(id as string,req.body)

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: false, message: "User not found!" });
    }
    res.status(200).json({
      status: true,
      message: "Updated user successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
}
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
  const result = await userService.deleteUserFromDB(id as string)
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: false, message: "User not found!" });
    }
    res.status(200).json({
      status: true,
      message: "Delete user successfully",
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
}
export const userController ={
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
}