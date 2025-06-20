"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrderSchema = exports.deleteOrderSchema = exports.updateOrderSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const sanitize = (val) => (0, sanitize_html_1.default)(val, {
    allowedTags: [],
    allowedAttributes: {}
});
const Items = zod_1.z.object({
    name: zod_1.z.string().min(1, "Item name cannot be empty").transform(sanitize),
    price: zod_1.z.number().nonnegative(),
    quantity: zod_1.z.number().int().min(1, "quantity cannot be less than one!"),
});
exports.createOrderSchema = zod_1.z.object({
    orderBy: zod_1.z.string().min(1, "Invalid customer name!").max(100).transform(sanitize),
    paidType: zod_1.z.enum(["YES", "NO"]),
    paymentMethod: zod_1.z.string().nullable().transform(val => val ? sanitize(val) : undefined),
    itemOrdered: Items.array(),
    orderDate: zod_1.z.string().optional(),
});
exports.updateOrderSchema = zod_1.z.object({
    paidType: zod_1.z.enum(["YES", "NO"]),
    paymentMethod: zod_1.z.string().nullable().transform(val => val ? sanitize(val) : undefined),
});
exports.deleteOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string().min(1).transform(sanitize)
});
exports.findOrderSchema = zod_1.z.object({
    paidType: zod_1.z.enum(["YES", "NO"]),
});
