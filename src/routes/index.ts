import { Router } from "express";
import authRouter from "../modules/auth/routes/auth.routes";
import orderRouter from "../modules/order/route/order.routes";
import adminRouter from "../modules/user/admin/admin.routes";

let indexRouter:Router = Router();
indexRouter.use('/auth',authRouter);
indexRouter.use("/user/orders",orderRouter);
indexRouter.use("/user",adminRouter)
export default indexRouter;