import { Router } from "express";
import { responseHandler } from "../../../utils/responseHandler/responseHandler";
import { login, Register } from "../controller/auth.controller";

const authRouter:Router = Router();

authRouter.post("/register",responseHandler(Register))
authRouter.post("/login",responseHandler(login))

export default authRouter;