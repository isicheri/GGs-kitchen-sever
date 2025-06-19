"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserAdmin = exports.deleteUser = exports.getUsersAdmin = exports.renderSettings = exports.renderNewOrders = exports.renderOrders = exports.getDashboard = void 0;
const order_controller_1 = require("../../order/controller/order.controller");
const user_service_1 = require("../service/user.service");
const badRequest_1 = require("../../../utils/Errors/badRequestError/badRequest");
const prismaClent_1 = __importDefault(require("../../../utils/prismaClient/prismaClent"));
const auth_validaton_1 = require("../../auth/validation/auth.validaton");
const getDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lastWeekCount, thisWeekCount, percentChange } = yield (0, order_controller_1.getTotalOrderOfTheWeeks)();
        const { todaysOrderCount } = yield (0, order_controller_1.getTodayTotalOrders)();
        const { todayTotalPrice, percentChangeOfTotalPrice } = yield (0, order_controller_1.getTodaysSalesAndCompare)();
        const { percentChangeOfTotalPriceMonthly, thisMonthTotalPrice } = yield (0, order_controller_1.getMonthlySalesAndCompare)();
        const graphData = yield (0, order_controller_1.getSalesGraphOrder)();
        const commpletedOrder = yield (0, order_controller_1.getAllCompletedOrder)();
        const pieData = yield (0, order_controller_1.getMostOrderedPieItem)();
        const { unpaidCount, totalUnPaidAmount, totalRevenue, paidOrdersCount } = yield (0, order_controller_1.getTotalUnpaidOrders)();
        res.render("admindashboard", {
            user: req.user,
            lastWeekCount: lastWeekCount,
            thisWeekCount: thisWeekCount,
            percentChange: percentChange,
            todaysOrderCount: todaysOrderCount,
            todayTotalPrice: todayTotalPrice,
            percentChangeOfTotalPrice: percentChangeOfTotalPrice,
            thisMonthTotalPrice: thisMonthTotalPrice,
            percentChangeOfTotalPriceMonthly: percentChangeOfTotalPriceMonthly,
            commpletedOrder: commpletedOrder,
            graphData: graphData,
            unpaidCount: unpaidCount,
            totalUnPaidAmount,
            paidOrdersCount: paidOrdersCount,
            totalRevenue,
            pieChartData: {
                lebels: pieData.labels,
                data: pieData.dataPie
            },
            currentPath: req.path
        });
    }
    catch (error) {
        res.redirect("/");
    }
});
exports.getDashboard = getDashboard;
const renderOrders = (req, res) => {
    res.render("orders", {
        user: req.user,
        currentPath: req.path
    });
};
exports.renderOrders = renderOrders;
const renderNewOrders = (req, res) => {
    res.render("new-orders", {
        user: req.user,
        currentPath: req.path
    });
};
exports.renderNewOrders = renderNewOrders;
const renderSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("settings", {
        user: req.user,
        currentPath: req.path
    });
});
exports.renderSettings = renderSettings;
//api-call-routes
const getUsersAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, user_service_1.getAllUsers)();
    res.status(200).json({
        success: true,
        data: users
    });
});
exports.getUsersAdmin = getUsersAdmin;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    let user = yield (0, user_service_1.getUserById)(userId);
    if (!user) {
        throw new badRequest_1.BadRequest("User not found", null);
    }
    yield prismaClent_1.default.user.delete({ where: { id: user.id } });
    res.status(200).json({
        success: true,
        message: "user deleted successfully"
    });
});
exports.deleteUser = deleteUser;
const createUserAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = auth_validaton_1.CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new badRequest_1.BadRequest(parsedData.error.message, parsedData.error);
    }
    const findUser = yield (0, user_service_1.getUser)({ username: parsedData.data.username });
    if (findUser) {
        throw new badRequest_1.BadRequest("user name already exist", null);
    }
    const user = yield (0, user_service_1.createUser)(parsedData.data);
    res.status(201).json({
        message: "user created successfully",
        success: true,
        data: {
            user: { username: user === null || user === void 0 ? void 0 : user.username, type: user === null || user === void 0 ? void 0 : user.userType }
        }
    });
});
exports.createUserAdmin = createUserAdmin;
