import { Router } from "express";
import { responseHandler } from "../../../utils/responseHandler/responseHandler";
import { login, logout, Register, renderLogin } from "../controller/auth.controller";
const authRouter:Router = Router();
authRouter.post("/register",responseHandler(Register))
authRouter.get("/login",renderLogin)
authRouter.post("/login",login)
authRouter.post("/logout",logout);
export default authRouter;