import { Router } from "express";
import authMiddleware from "../../../middleware/auth.middleware";
import { responseHandler } from "../../../utils/responseHandler/responseHandler";
import { createOrder ,findOrderById,getAllOrders, removeOrder, updateOrderStatus } from "../controller/order.controller";

const orderRouter:Router = Router();
orderRouter.use(authMiddleware)
orderRouter.post("/create",responseHandler(createOrder))
orderRouter.delete("/delete/:orderId",responseHandler(removeOrder));
orderRouter.get("/find-order/:orderId",responseHandler(findOrderById));
orderRouter.patch("/update-order-status/:orderId",responseHandler(updateOrderStatus))
orderRouter.get("/get-all",responseHandler(getAllOrders));

export default orderRouter;