import { Router } from "express";
import authRouter from "../modules/auth/routes/auth.routes";
import orderRouter from "../modules/order/route/order.routes";

let indexRouter:Router = Router();
indexRouter.use('/auth',authRouter);
indexRouter.use("/order/",orderRouter);
export default indexRouter;