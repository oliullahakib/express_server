import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRouter } from "./modules/users/user.router";
import { profileRoter } from "./modules/profiles/profile.router";
import { authRouter } from "./modules/auth/auth.route";
const app: Application = express();


//middlewaer
app.use(express.json());

app.use("/api/v1/users",userRouter)
app.use("/api/v1/profiles",profileRoter)
app.use("/api/v1/auth",authRouter)
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: true, message: "Welcome to the server!" });
});

export default app
