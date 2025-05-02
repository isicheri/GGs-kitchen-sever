import { Router } from "express";
import authMiddleware from "../../../middleware/auth.middleware";

const orderRouter:Router = Router();
orderRouter.use(authMiddleware)

export default orderRouter;