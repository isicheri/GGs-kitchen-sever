import { NextFunction, Request, Response } from "express"
import prismaClient from "../../../utils/prismaClient/prismaClent"
import { createOrderSchema, deleteOrderSchema, findOrderSchema, updateOrderSchema } from "../validation/order.validation"
import { BadRequest } from "../../../utils/Errors/badRequestError/badRequest";
import { Order } from "../../../../generated/prisma";
import { findManyQuery } from "../repos/order.repos";

export const createOrder = async(req:Request,res:Response,next:NextFunction) => {
const parsedData = createOrderSchema.safeParse(req.body);
if(!parsedData.success) {
    throw new BadRequest("cannot process input",parsedData.error);
}
const {orderBy,paidType,itemOrdered} = parsedData.data;
const order = await prismaClient.order.create({data: {orderBy:orderBy,paid: paidType,itemsOrdered: {
    create: itemOrdered.map((value) => ({
        name: value.name,
        price: value.price,
        quantity: value.quantity,
    }))
}}});
res.status(201).json({
    success: true,
    message: "order created successfully",
    data: {
        order
    }
})
} 

export const updateOrder = async(req:Request,res:Response,next:NextFunction) => {
const parsedData =  updateOrderSchema.safeParse(req.body);
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

//the get feature

export const getAllOrders = async(req:Request,res:Response,next:NextFunction) => {
    const orders = await prismaClient.order.findMany({select: {
        orderBy: true,
        itemsOrdered: true,
        paid: true,
        createAt: true
    }})
    res.status(200).json({
        success: true,
         data: orders
    })
}

export const getAllLatestOrders = async(req:Request,res:Response,next:NextFunction) => {
    const orders = await prismaClient.order.findMany({take: 10,select: {orderBy:true,itemsOrdered:true,paid: true},orderBy: {
        createAt: "desc"
    }})
    res.status(200).json({
        success: true,
        data: orders
    })
}

export const filterOrdersByPaid = async (req:Request,res:Response,next:NextFunction) => { 
    const parsedData = findOrderSchema.safeParse(req.params);
    if(!parsedData.success) {
        throw new BadRequest(parsedData.error.message,parsedData.error)
    }
    const {paidType} = parsedData.data
    const orders = await findManyQuery("order",paidType);
     res.status(200).json({
        success: true,
        data: orders
    })
} 