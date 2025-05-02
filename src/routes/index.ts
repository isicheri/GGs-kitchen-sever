import { Router } from "express";
import authRouter from "../modules/auth/routes/auth.routes";

let indexRouter:Router = Router();
indexRouter.use('/auth',authRouter);
export default indexRouter;