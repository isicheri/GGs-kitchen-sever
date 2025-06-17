"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../../../middleware/auth.middleware"));
const responseHandler_1 = require("../../../utils/responseHandler/responseHandler");
const order_controller_1 = require("../controller/order.controller");
const orderRouter = (0, express_1.Router)();
orderRouter.use(auth_middleware_1.default);
orderRouter.post("/create", (0, responseHandler_1.responseHandler)(order_controller_1.createOrder));
orderRouter.delete("/delete/:orderId", (0, responseHandler_1.responseHandler)(order_controller_1.removeOrder));
orderRouter.get("/find-order/:orderId", (0, responseHandler_1.responseHandler)(order_controller_1.findOrderById));
orderRouter.patch("/update-order-status/:orderId", (0, responseHandler_1.responseHandler)(order_controller_1.updateOrderStatus));
orderRouter.get("/get-all", (0, responseHandler_1.responseHandler)(order_controller_1.getAllOrders));
exports.default = orderRouter;
