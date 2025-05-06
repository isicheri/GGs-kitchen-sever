import { Item } from "../../../../generated/prisma";

export type IitemsOrdered = Pick<Item,"id" | "name" | "price" | "orderId" | "quantity">;