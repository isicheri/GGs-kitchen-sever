"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrderSchema = exports.deleteOrderSchema = exports.updateOrderSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const Items = zod_1.z.object({
    name: zod_1.z.string(),
    price: zod_1.z.number(),
    quantity: zod_1.z.number(),
});
exports.createOrderSchema = zod_1.z.object({
    orderBy: zod_1.z.string(),
    paidType: zod_1.z.enum(["YES", "NO"]),
    paymentMethod: zod_1.z.string().nullable(),
    itemOrdered: Items.array()
});
exports.updateOrderSchema = zod_1.z.object({
    paidType: zod_1.z.enum(["YES", "NO"]),
});
exports.deleteOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string()
});
exports.findOrderSchema = zod_1.z.object({
    paidType: zod_1.z.enum(["YES", "NO"]),
});
