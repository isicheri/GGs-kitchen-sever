import { NextFunction, Request, Response } from "express"
import prismaClient from "../../../utils/prismaClient/prismaClent"
import { addItemSchema, createOrderSchema, deleteOrderSchema } from "../validation/order.validation"
import { BadRequest } from "../../../utils/Errors/badRequestError/badRequest";
import { Order } from "../../../generated/prisma";

export const createOrder = async(req:Request,res:Response,next:NextFunction) => {
const parsedData = createOrderSchema.safeParse(req.body);
if(!parsedData.success) {
    throw new BadRequest("cannot process input",parsedData.error);
}
const {orderBy,paidType} = parsedData.data;
const order = await prismaClient.order.create({data: {orderBy:orderBy,paid: paidType}});
res.status(201).json({
    success: true,
    message: "order created successfully",
    data: {
        order
    }
})
} 

export const addItemsToOrder = async(req:Request,res:Response,next:NextFunction) => {
    const parsedData = addItemSchema.safeParse(req.body)
    if(!parsedData.success) {
        throw new BadRequest("invalid input! check again",parsedData.error);
    }
   const {itemsOrdered} = parsedData.data;
   const items = await prismaClient.item.createMany({data: itemsOrdered});
   res.status(201).json({
    success: true,
    message: "items added successfully",
    data: {
        items
    }
})
}

export const updateOrder = async(req:Request,res:Response,next:NextFunction) => {
const parsedData =  createOrderSchema.safeParse(req.body);
const {orderId} = req.params;
if(!parsedData.success) {
    throw new BadRequest("invalid input! check again",parsedData.error);
}
const order = await prismaClient.order.update({where: {id: orderId},data: {
    ...parsedData.data
}}) 
res.status(200).json({
    success: true,
    message: "order successfully updated",
    data: {
        order
    }
})
}


export const removeOrder = async(req:Request,res:Response,next:NextFunction)  => {
const parsedData = deleteOrderSchema.safeParse(req.params);
if(!parsedData.success) {
    throw new BadRequest("invalid input",parsedData.error);
}
const findOrder = await getOrderById(parsedData.data.orderId);
if(!findOrder) {
    throw new BadRequest("Order does not exist",null);
}
await prismaClient.order.delete({where: {id:findOrder.id}});
}

const getOrderById = async(orderId: string): Promise<Order | null> => {
    const order = await prismaClient.order.findFirst({where: {id: orderId}});
    return order
}

//admin features