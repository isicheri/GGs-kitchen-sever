import { Router } from "express";
import authMiddleware from "../../../middleware/auth.middleware";
import { createUserAdmin, deleteUser, getDashboard, getUsersAdmin, renderNewOrders, renderOrders, renderSettings } from "./admin.controller";
import { stopCache } from "../../../utils/index.utils";
import adminMiddleware from "../../../middleware/admin.middleware";
import { responseHandler } from "../../../utils/responseHandler/responseHandler";

const adminRouter = Router()
adminRouter.use(stopCache)
adminRouter.use(authMiddleware)
adminRouter.get("/dashboard",getDashboard);
adminRouter.get("/orders", renderOrders);
adminRouter.get("/new-orders", renderNewOrders);
adminRouter.get("/settings",adminMiddleware, renderSettings);

//api-call-routes
adminRouter.get("/get-allUsers",adminMiddleware,responseHandler(getUsersAdmin));
adminRouter.delete("/delete-user/:userId",adminMiddleware,responseHandler(deleteUser));
adminRouter.post("/create-user",adminMiddleware,responseHandler(createUserAdmin));

export default adminRouter;