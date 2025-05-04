import { Router } from "express";
import authMiddleware from "../../../middleware/auth.middleware";
import { responseHandler } from "../../../utils/responseHandler/responseHandler";
import { createOrder, getAllLatestOrders, getAllOrders, removeOrder, updateOrder } from "../controller/order.controller";

const orderRouter:Router = Router();
orderRouter.use(authMiddleware)
orderRouter.post("/create",responseHandler(createOrder))
orderRouter.put('/update/:orderId',responseHandler(updateOrder));
orderRouter.delete("/delete/:orderId",responseHandler(removeOrder));
orderRouter.get("/get-all",responseHandler(getAllOrders));
orderRouter.get("/get-latest",responseHandler(getAllLatestOrders));

export default orderRouter;