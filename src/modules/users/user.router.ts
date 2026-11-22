import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_Roll } from "../../types";


const router = Router()
/* /api/v1/users/ */
router.post("/", userController.createUser);
router.get("/", auth(USER_Roll.admin,USER_Roll.agent) ,userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.put("/:id",auth(USER_Roll.admin,USER_Roll.user), userController.updateUser);
router.delete("/:id",userController.deleteUser);
export const userRouter = router;