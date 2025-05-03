import { Router } from "express";
import authMiddleware from "../../../middleware/auth.middleware";
import { responseHandler } from "../../../utils/responseHandler/responseHandler";
import { addItemsToOrder, createOrder, removeOrder, updateOrder } from "../controller/order.controller";

const orderRouter:Router = Router();
orderRouter.use(authMiddleware)
orderRouter.post("/create",responseHandler(createOrder))
orderRouter.post("/add-items",responseHandler(addItemsToOrder))
orderRouter.put('/update/:orderId',responseHandler(updateOrder));
orderRouter.delete("/delete/:orderId",responseHandler(removeOrder))

export default orderRouter;