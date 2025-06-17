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
exports.findManyQuery = findManyQuery;
exports.findOneQuery = findOneQuery;
const prismaClent_1 = __importDefault(require("../../../utils/prismaClient/prismaClent"));
function findManyQuery(table, query) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (table) {
            case "order":
                const orders = yield prismaClent_1.default.order.findMany({ where: {
                        paid: query
                    }, include: { itemsOrdered: true } });
                return orders;
            default:
                return null;
        }
    });
}
function findOneQuery(table, query) {
    return __awaiter(this, void 0, void 0, function* () { });
}
