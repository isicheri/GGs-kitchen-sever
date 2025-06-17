"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/routes/auth.routes"));
const order_routes_1 = __importDefault(require("../modules/order/route/order.routes"));
const admin_routes_1 = __importDefault(require("../modules/user/admin/admin.routes"));
let indexRouter = (0, express_1.Router)();
indexRouter.use('/auth', auth_routes_1.default);
indexRouter.use("/user/orders", order_routes_1.default);
indexRouter.use("/user", admin_routes_1.default);
exports.default = indexRouter;
