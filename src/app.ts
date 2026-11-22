import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { userRouter } from "./modules/users/user.router";
import { profileRoter } from "./modules/profiles/profile.router";
import { authRouter } from "./modules/auth/auth.route";
import logger from "./middleware/logger";

const app: Application = express();


//middlewaer
app.use(express.json());

//custom middleware
app.use(logger)

// router middleware
app.use("/api/v1/users",userRouter)
app.use("/api/v1/profiles",profileRoter)
app.use("/api/v1/auth",authRouter)
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: true, message: "Welcome to the server!" });
});



export default app
