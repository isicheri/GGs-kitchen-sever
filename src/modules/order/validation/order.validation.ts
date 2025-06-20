import { z } from "zod";
import sanitizeHtml from "sanitize-html";

const sanitize = (val: string) => sanitizeHtml(val,{
    allowedTags: [],
    allowedAttributes: {}
})

const Items = z.object({
   name: z.string().min(1, "Item name cannot be empty").transform(sanitize),
    price: z.number().nonnegative(),
    quantity: z.number().int().min(1,"quantity cannot be less than one!"),
})

export const createOrderSchema = z.object({
    orderBy: z.string().min(1,"Invalid customer name!").max(100).transform(sanitize),
    paidType: z.enum(["YES","NO"]),
    paymentMethod: z.string().nullable().transform(val => val ? sanitize(val) : undefined),
    itemOrdered: Items.array(),
    orderDate: z.string().optional(), 
})


export const updateOrderSchema = z.object({
     paidType: z.enum(["YES","NO"]),
     paymentMethod: z.string().nullable().transform(val => val ? sanitize(val) : undefined),
})

export const deleteOrderSchema = z.object({
  orderId: z.string().min(1).transform(sanitize)

})

export const findOrderSchema = z.object({
    paidType: z.enum(["YES","NO"]),
})