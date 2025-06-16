import { z } from "zod"

const Items = z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
})

export const createOrderSchema = z.object({
    orderBy: z.string(),
    paidType: z.enum(["YES","NO"]),
    paymentMethod: z.string().nullable(),
    itemOrdered: Items.array()
})


export const updateOrderSchema = z.object({
    paidType: z.enum(["YES","NO"]),
})

export const deleteOrderSchema = z.object({
    orderId: z.string()
})

export const findOrderSchema = z.object({
    paidType: z.enum(["YES","NO"]),
})