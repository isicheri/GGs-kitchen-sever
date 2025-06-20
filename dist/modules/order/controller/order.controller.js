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
exports.getTotalUnpaidOrders = exports.getMostOrderedPieItem = exports.getSalesGraphOrder = exports.getTotalOrderOfTheWeeks = exports.getTodayTotalOrders = exports.getTodaysSalesAndCompare = exports.getMonthlySalesAndCompare = exports.getAllCompletedOrder = exports.getAllOrders = exports.findOrderById = exports.removeOrder = exports.updateOrderStatus = exports.createOrder = void 0;
const prismaClent_1 = __importDefault(require("../../../utils/prismaClient/prismaClent"));
const order_validation_1 = require("../validation/order.validation");
const badRequest_1 = require("../../../utils/Errors/badRequestError/badRequest");
const date_fns_1 = require("date-fns");
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = order_validation_1.createOrderSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new badRequest_1.BadRequest("cannot process input", parsedData.error);
    }
    const { orderBy, paidType, itemOrdered, paymentMethod, orderDate } = parsedData.data;
    if (orderDate) {
        const selected = new Date(orderDate);
        const today = new Date();
        selected.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        if (selected > today) {
            throw new badRequest_1.BadRequest("Order date cannot be in the future", null);
        }
    }
    const dateToUse = orderDate ? new Date(orderDate) : new Date();
    const order = yield prismaClent_1.default.order.create({ data: { orderBy: orderBy.toUpperCase(), paid: paidType, paymentMethod: paymentMethod, createAt: dateToUse, itemsOrdered: {
                create: itemOrdered.map((value) => ({
                    name: value.name.toUpperCase(),
                    price: value.price,
                    quantity: value.quantity,
                }))
            } } });
    res.status(201).json({
        success: true,
        message: "order created successfully",
        data: {
            order
        }
    });
});
exports.createOrder = createOrder;
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parsedData = order_validation_1.updateOrderSchema.safeParse(req.body);
    const { orderId } = req.params;
    if (!parsedData.success) {
        throw new badRequest_1.BadRequest("invalid input! check again", parsedData.error);
    }
    yield prismaClent_1.default.order.update({ where: { id: orderId }, data: {
            paid: parsedData.data.paidType,
            paymentMethod: (_a = parsedData.data.paymentMethod) === null || _a === void 0 ? void 0 : _a.toUpperCase()
        } });
    res.status(200).json({
        success: true,
        message: "order successfully updated",
    });
});
exports.updateOrderStatus = updateOrderStatus;
const removeOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = order_validation_1.deleteOrderSchema.safeParse(req.params);
    if (!parsedData.success) {
        throw new badRequest_1.BadRequest("invalid input", parsedData.error);
    }
    const findOrder = yield getOrderById(parsedData.data.orderId);
    if (!findOrder) {
        throw new badRequest_1.BadRequest("Order does not exist", null);
    }
    yield prismaClent_1.default.order.delete({ where: { id: findOrder.id } });
    res.status(200).json({
        message: "order deleted successfully"
    });
});
exports.removeOrder = removeOrder;
const getOrderById = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prismaClent_1.default.order.findFirst({ where: { id: orderId } });
    return order;
});
const findOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = order_validation_1.deleteOrderSchema.safeParse(req.params);
    if (!parsedData.success) {
        throw new badRequest_1.BadRequest("invalid input", parsedData.error);
    }
    let order = yield prismaClent_1.default.order.findFirst({ where: { id: parsedData.data.orderId }, include: {
            itemsOrdered: true,
        } });
    res.status(200).json({
        success: true,
        data: order
    });
});
exports.findOrderById = findOrderById;
//admin features
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const status = req.query.status;
    const search = req.query.search;
    const whereClause = {};
    if (status)
        whereClause.paid = status;
    if (search)
        whereClause.orderBy = { contains: search, mode: 'insensitive' };
    const [orders, total] = yield prismaClent_1.default.$transaction([
        prismaClent_1.default.order.findMany({
            where: whereClause,
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: { createAt: 'desc' },
            include: {
                itemsOrdered: true, // include item details
            },
        }),
        prismaClent_1.default.order.count({ where: whereClause }),
    ]);
    // Add totalAmount to each order
    const enrichedOrders = orders.map(order => {
        const totalAmount = order.itemsOrdered.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return Object.assign(Object.assign({}, order), { totalAmount });
    });
    res.status(200).json({
        success: true,
        data: enrichedOrders,
        pagination: {
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
        },
    });
});
exports.getAllOrders = getAllOrders;
const getAllCompletedOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    const order = prismaClent_1.default.order.count();
    return order;
});
exports.getAllCompletedOrder = getAllCompletedOrder;
//this is to get monthly sales and compare it with yesterdays sales
const getMonthlySalesAndCompare = () => __awaiter(void 0, void 0, void 0, function* () {
    const startOfmonth = (0, date_fns_1.startOfMonth)(new Date());
    const endOfmonth = (0, date_fns_1.endOfMonth)(new Date());
    //last month data
    const startOfLastMonth = (0, date_fns_1.subMonths)(startOfmonth, 1);
    const endOfLastMonth = (0, date_fns_1.endOfMonth)(startOfLastMonth);
    const [thisMonthOrders, lastMonthOrders] = yield prismaClent_1.default.$transaction([
        prismaClent_1.default.order.findMany({
            where: {
                createAt: {
                    gte: startOfmonth,
                    lte: endOfmonth
                }
            },
            include: {
                itemsOrdered: true
            }
        }),
        prismaClent_1.default.order.findMany({
            where: {
                createAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth
                }
            },
            include: {
                itemsOrdered: true
            }
        })
    ]);
    let itemOrderedThismonth = thisMonthOrders.flatMap((order) => order.itemsOrdered);
    let itemsOrderedLastmonth = lastMonthOrders.flatMap((order) => order.itemsOrdered);
    let thisMonthTotalPrice = itemOrderedThismonth.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let lastMonthTotalPrice = itemsOrderedLastmonth.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let percentChangeOfTotalPriceMonthly = 0;
    if (lastMonthTotalPrice === 0) {
        percentChangeOfTotalPriceMonthly = thisMonthTotalPrice > 0 ? 100 : 0;
    }
    else {
        percentChangeOfTotalPriceMonthly = ((thisMonthTotalPrice - lastMonthTotalPrice) / lastMonthTotalPrice) * 100;
    }
    return { percentChangeOfTotalPriceMonthly, thisMonthTotalPrice };
});
exports.getMonthlySalesAndCompare = getMonthlySalesAndCompare;
//this is to get todays sales and compare it with yesterdays sales
const getTodaysSalesAndCompare = () => __awaiter(void 0, void 0, void 0, function* () {
    const startOfday = (0, date_fns_1.startOfDay)(new Date());
    const endOfday = (0, date_fns_1.endOfDay)(new Date());
    const startOfYesterday = (0, date_fns_1.subDays)(startOfday, 1);
    const endOfYesterday = (0, date_fns_1.endOfDay)(startOfYesterday);
    const [yesterdaysOrders, todaysOrders] = yield prismaClent_1.default.$transaction([
        prismaClent_1.default.order.findMany({
            where: {
                createAt: {
                    gte: startOfYesterday,
                    lte: endOfYesterday,
                },
            },
            include: {
                itemsOrdered: true,
            },
        }),
        prismaClent_1.default.order.findMany({
            where: {
                createAt: {
                    gte: startOfday,
                    lte: endOfday,
                },
            },
            include: {
                itemsOrdered: true,
            },
        }),
    ]);
    let totalItemsOrderedToday = todaysOrders.flatMap((order) => order.itemsOrdered);
    let totalItemsOrderedYesterday = yesterdaysOrders.flatMap((order) => order.itemsOrdered);
    let todayTotalPrice = totalItemsOrderedToday.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let yesterdayTotalPrice = totalItemsOrderedYesterday.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let percentChangeOfTotalPrice = 0;
    if (yesterdayTotalPrice === 0) {
        percentChangeOfTotalPrice = todayTotalPrice > 0 ? 100 : 0;
    }
    else {
        percentChangeOfTotalPrice = ((todayTotalPrice - yesterdayTotalPrice) / yesterdayTotalPrice) * 100;
    }
    return { todayTotalPrice, percentChangeOfTotalPrice };
});
exports.getTodaysSalesAndCompare = getTodaysSalesAndCompare;
//this get the total count for today
const getTodayTotalOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const startOfday = (0, date_fns_1.startOfDay)(new Date());
    const endOfday = (0, date_fns_1.endOfDay)(new Date());
    const todaysOrderCount = yield prismaClent_1.default.order.count({
        where: {
            createAt: {
                gte: startOfday,
                lte: endOfday
            }
        }
    });
    return { todaysOrderCount };
});
exports.getTodayTotalOrders = getTodayTotalOrders;
//this get the total orders of the weeks and compare
const getTotalOrderOfTheWeeks = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const startOfThisWeek = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 });
    // Last week's range
    const startOfLastWeek = (0, date_fns_1.subWeeks)(startOfThisWeek, 1);
    const endOfLastWeek = (0, date_fns_1.endOfWeek)(startOfLastWeek, { weekStartsOn: 1 });
    const thisWeekCount = yield prismaClent_1.default.order.count({
        where: {
            createAt: {
                gte: startOfThisWeek,
                lte: now
            }
        }
    });
    const lastWeekCount = yield prismaClent_1.default.order.count({
        where: {
            createAt: {
                gte: startOfLastWeek,
                lte: endOfLastWeek
            }
        }
    });
    let percentChange = 0;
    if (lastWeekCount === 0) {
        percentChange = thisWeekCount > 0 ? 100 : 0;
    }
    else {
        percentChange = ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
    }
    return {
        lastWeekCount,
        thisWeekCount,
        percentChange
    };
});
exports.getTotalOrderOfTheWeeks = getTotalOrderOfTheWeeks;
const getSalesGraphOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    // get the last 7 days
    //  let dayOne = startOfDay(new Date());
    //  let daytwo = subDays(dayOne,1);
    //  let dayThree = subDays(daytwo,1);
    //  let dayFour = subDays(dayThree,1);
    //  let dayFive = subDays(dayFour,1);
    //  let daySix =  subDays(dayFive,1);
    //  let daySeven = subDays(daySix,1);
    const today = (0, date_fns_1.startOfDay)(new Date());
    let dateArray = Array.from({ length: 7 }, (_, i) => (0, date_fns_1.subDays)(today, i)).reverse();
    const dailyOrders = yield Promise.all(dateArray.map((date) => prismaClent_1.default.order.findMany({
        where: {
            createAt: {
                gte: (0, date_fns_1.startOfDay)(date),
                lte: (0, date_fns_1.endOfDay)(date),
            },
        },
        include: {
            itemsOrdered: true,
        },
    })));
    let salesPerDay = dailyOrders.map((orderForDay, index) => {
        let totalSales = orderForDay.flatMap((order) => order.itemsOrdered).reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return {
            date: (0, date_fns_1.format)(dateArray[index], 'yyyy-MM-dd'),
            totalSales: parseFloat(totalSales.toFixed(2))
        };
    });
    return salesPerDay;
});
exports.getSalesGraphOrder = getSalesGraphOrder;
const getMostOrderedPieItem = () => __awaiter(void 0, void 0, void 0, function* () {
    let startOfmonth = (0, date_fns_1.startOfMonth)(new Date());
    let endOfmonth = (0, date_fns_1.endOfMonth)(new Date());
    const orders = yield prismaClent_1.default.order.findMany({
        where: {
            createAt: {
                gte: startOfmonth,
                lte: endOfmonth
            }
        },
        include: {
            itemsOrdered: true
        }
    });
    let itemOrdered = orders.flatMap((order) => order.itemsOrdered);
    let itemMap = new Map();
    itemOrdered.forEach((item) => {
        const name = item.name;
        const currentCount = itemMap.get(name) || 0;
        itemMap.set(name, currentCount + 1);
    });
    const labels = Array.from(itemMap.keys());
    const dataPie = Array.from(itemMap.values());
    return { labels, dataPie };
});
exports.getMostOrderedPieItem = getMostOrderedPieItem;
const getTotalUnpaidOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const ordersCount = yield prismaClent_1.default.order.count({ where: { paid: "NO" } });
    const paidOrdersCount = yield prismaClent_1.default.order.count({ where: { paid: "YES" } });
    const totalAmount = (yield prismaClent_1.default.order.findMany({ include: { itemsOrdered: true } })).flatMap((order) => order.itemsOrdered).reduce((sum, items) => sum + (items.price * items.quantity), 0);
    const totalUnPaidAmount = (yield prismaClent_1.default.order.findMany({ where: { paid: "NO" }, include: { itemsOrdered: true } })).flatMap((order) => order.itemsOrdered).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { unpaidCount: ordersCount, totalUnPaidAmount: totalUnPaidAmount, totalRevenue: totalAmount - totalUnPaidAmount, paidOrdersCount: paidOrdersCount };
});
exports.getTotalUnpaidOrders = getTotalUnpaidOrders;
