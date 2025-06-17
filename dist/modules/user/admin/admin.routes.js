"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../../../middleware/auth.middleware"));
const admin_controller_1 = require("./admin.controller");
const index_utils_1 = require("../../../utils/index.utils");
const admin_middleware_1 = __importDefault(require("../../../middleware/admin.middleware"));
const responseHandler_1 = require("../../../utils/responseHandler/responseHandler");
const adminRouter = (0, express_1.Router)();
adminRouter.use(index_utils_1.stopCache);
adminRouter.use(auth_middleware_1.default);
adminRouter.get("/dashboard", admin_controller_1.getDashboard);
adminRouter.get("/orders", admin_controller_1.renderOrders);
adminRouter.get("/new-orders", admin_controller_1.renderNewOrders);
adminRouter.get("/settings", admin_middleware_1.default, admin_controller_1.renderSettings);
//api-call-routes
adminRouter.get("/get-allUsers", admin_middleware_1.default, (0, responseHandler_1.responseHandler)(admin_controller_1.getUsersAdmin));
adminRouter.delete("/delete-user/:userId", admin_middleware_1.default, (0, responseHandler_1.responseHandler)(admin_controller_1.deleteUser));
adminRouter.post("/create-user", admin_middleware_1.default, (0, responseHandler_1.responseHandler)(admin_controller_1.createUserAdmin));
exports.default = adminRouter;
