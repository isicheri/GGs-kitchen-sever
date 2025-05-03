import { z } from "zod"


const Items = z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    orderId: z.string()
})

export const createOrderSchema = z.object({
    orderBy: z.string(),
    paidType: z.enum(["YES","NO"])
})

export const addItemSchema = z.object({
    itemsOrdered: Items.array()
})

export const deleteOrderSchema = z.object({
    orderId: z.string()
})