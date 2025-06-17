import { NextFunction, Request, Response } from "express"
import prismaClient from "../../../utils/prismaClient/prismaClent"
import { createOrderSchema, deleteOrderSchema, findOrderSchema, updateOrderSchema } from "../validation/order.validation"
import { BadRequest } from "../../../utils/Errors/badRequestError/badRequest";
import { Order } from "../../../../generated/prisma";
import {startOfWeek,endOfWeek,subWeeks,startOfDay,endOfDay,subDays,startOfMonth,endOfMonth, subMonths, format} from "date-fns";

export const createOrder = async(req:Request,res:Response,next:NextFunction) => {
const parsedData = createOrderSchema.safeParse(req.body);
if(!parsedData.success) {
    throw new BadRequest("cannot process input",parsedData.error);
}
const {orderBy,paidType,itemOrdered,paymentMethod} = parsedData.data;
const order = await prismaClient.order.create({data: {orderBy:orderBy.toUpperCase(),paid: paidType,paymentMethod: paymentMethod,itemsOrdered: {
    create: itemOrdered.map((value) => ({
        name: value.name.toUpperCase(),
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

export const updateOrderStatus = async(req:Request,res:Response,next:NextFunction) => {
const parsedData =  updateOrderSchema.safeParse(req.body);
const {orderId} = req.params;
if(!parsedData.success) {
    throw new BadRequest("invalid input! check again",parsedData.error);
}
 await prismaClient.order.update({where: {id: orderId},data: {
    paid: parsedData.data.paidType,
    paymentMethod: parsedData.data.paymentMethod?.toUpperCase()
}}) 
res.status(200).json({
    success: true,
    message: "order successfully updated",
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
res.status(200).json({
  message: "order deleted successfully"
})
}

const getOrderById = async(orderId: string): Promise<Order | null> => {
    const order = await prismaClient.order.findFirst({where: {id: orderId}});
    return order
}

export const findOrderById = async (req:Request,res:Response) => {
const parsedData = deleteOrderSchema.safeParse(req.params);
if(!parsedData.success) {
    throw new BadRequest("invalid input",parsedData.error);
} 
let order = await prismaClient.order.findFirst({where: {id: parsedData.data.orderId},include: {
  itemsOrdered:true,
}})
res.status(200).json({
  success: true,
  data: order
})
}

//admin features
export const getAllOrders = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = 10;
  const status = req.query.status as 'YES' | 'NO' | undefined;
  const search = req.query.search as string;

  const whereClause: any = {};
  if (status) whereClause.paid = status;
  if (search) whereClause.orderBy = { contains: search, mode: 'insensitive' };

  const [orders, total] = await prismaClient.$transaction([
    prismaClient.order.findMany({
      where: whereClause,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createAt: 'desc' },
      include: {
        itemsOrdered: true, // include item details
      },
    }),
    prismaClient.order.count({ where: whereClause }),
  ]);

  // Add totalAmount to each order
  const enrichedOrders = orders.map(order => {
    const totalAmount = order.itemsOrdered.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return {
      ...order,
      totalAmount,
    };
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
};

export const getAllCompletedOrder = async ():Promise<number> => {
  const order = prismaClient.order.count();
  return order
}
 
//this is to get monthly sales and compare it with yesterdays sales
export const getMonthlySalesAndCompare = async():Promise<{percentChangeOfTotalPriceMonthly: number,thisMonthTotalPrice:number}> => {
const startOfmonth = startOfMonth(new Date());
const endOfmonth = endOfMonth(new Date());

//last month data
const startOfLastMonth = subMonths(startOfmonth,1);
const endOfLastMonth  = endOfMonth(startOfLastMonth);

const [thisMonthOrders,lastMonthOrders ] =  await prismaClient.$transaction([
 prismaClient.order.findMany({
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
 prismaClient.order.findMany({
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
])

let itemOrderedThismonth = thisMonthOrders.flatMap((order) => order.itemsOrdered);
let itemsOrderedLastmonth = lastMonthOrders.flatMap((order) => order.itemsOrdered);

let thisMonthTotalPrice = itemOrderedThismonth.reduce((sum,item) => sum + (item.price * item.quantity),0);
let lastMonthTotalPrice = itemsOrderedLastmonth.reduce((sum,item) => sum + (item.price * item.quantity),0);

   let percentChangeOfTotalPriceMonthly = 0;

   if(lastMonthTotalPrice === 0) {
    percentChangeOfTotalPriceMonthly =   thisMonthTotalPrice >  0 ? 100 : 0;
   }else {
   percentChangeOfTotalPriceMonthly =((thisMonthTotalPrice - lastMonthTotalPrice) / lastMonthTotalPrice) * 100; 
   }


   return {percentChangeOfTotalPriceMonthly,thisMonthTotalPrice}

}

//this is to get todays sales and compare it with yesterdays sales
export const getTodaysSalesAndCompare = async(): Promise<{todayTotalPrice:number,percentChangeOfTotalPrice: number}> => {
    const startOfday = startOfDay(new Date());
    const endOfday = endOfDay(new Date());

    const startOfYesterday = subDays(startOfday,1);
    const endOfYesterday = endOfDay(startOfYesterday)


const [yesterdaysOrders, todaysOrders] = await prismaClient.$transaction([
  prismaClient.order.findMany({
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
  prismaClient.order.findMany({
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
   let todayTotalPrice = totalItemsOrderedToday.reduce((sum,item) => sum + (item.price * item.quantity),0);
   let yesterdayTotalPrice = totalItemsOrderedYesterday.reduce((sum,item) => sum + (item.price * item.quantity),0);

   let percentChangeOfTotalPrice = 0;
  if (yesterdayTotalPrice === 0) {
    percentChangeOfTotalPrice = todayTotalPrice > 0 ? 100 : 0;
  } else {
    percentChangeOfTotalPrice = ((todayTotalPrice - yesterdayTotalPrice) / yesterdayTotalPrice) * 100;
  } 
   return {todayTotalPrice,percentChangeOfTotalPrice}

}

//this get the total count for today
export const getTodayTotalOrders = async():Promise<{todaysOrderCount: number}> => {

   const startOfday = startOfDay(new Date());
   const endOfday = endOfDay(new Date());

    const todaysOrderCount = await prismaClient.order.count({
        where: {
            createAt: {
                gte: startOfday,
                lte: endOfday
            }
        }
    })
    return {todaysOrderCount};
}

//this get the total orders of the weeks and compare
export const getTotalOrderOfTheWeeks = async() : Promise<{
  lastWeekCount: number;
  thisWeekCount: number;
  percentChange: number;
}> => {
   const now = new Date();
   const startOfThisWeek = startOfWeek(now, {weekStartsOn: 1}); 

   // Last week's range
const startOfLastWeek = subWeeks(startOfThisWeek, 1);
const endOfLastWeek = endOfWeek(startOfLastWeek,{weekStartsOn: 1})

const thisWeekCount = await prismaClient.order.count({
    where: {
        createAt: {
            gte: startOfThisWeek,
            lte: now
        }
    }
})

const lastWeekCount = await prismaClient.order.count({
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
} else {
  percentChange = ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
}

return {
    lastWeekCount,
    thisWeekCount,
    percentChange
}

}

export const getSalesGraphOrder = async (): Promise<{
    date: string;
    totalSales: number;
}[]> => {
  // get the last 7 days
  //  let dayOne = startOfDay(new Date());
  //  let daytwo = subDays(dayOne,1);
  //  let dayThree = subDays(daytwo,1);
  //  let dayFour = subDays(dayThree,1);
  //  let dayFive = subDays(dayFour,1);
  //  let daySix =  subDays(dayFive,1);
  //  let daySeven = subDays(daySix,1);

   const today = startOfDay(new Date());
   let dateArray = Array.from({length: 7},(_,i) => subDays(today,i)).reverse();


   const dailyOrders = await Promise.all(
  dateArray.map((date) =>
    prismaClient.order.findMany({
      where: {
        createAt: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
      include: {
        itemsOrdered: true,
      },
    })
  )
);

let salesPerDay = dailyOrders.map((orderForDay,index) => {
   let totalSales = orderForDay.flatMap((order) => order.itemsOrdered).reduce((sum,item) => sum + (item.price * item.quantity),0);
   return {
    date: format(dateArray[index],'yyyy-MM-dd'),
    totalSales: parseFloat(totalSales.toFixed(2))
   }
})

return salesPerDay;

}

export const getMostOrderedPieItem = async (): Promise<{labels: string[],dataPie: number[]}> => {
  let startOfmonth = startOfMonth(new Date());
  let endOfmonth = endOfMonth(new Date());
  const orders = await prismaClient.order.findMany({
    where: {
      createAt: {
        gte: startOfmonth,
        lte: endOfmonth
      }
    },
    include: {
      itemsOrdered: true
    }
  })
  let itemOrdered = orders.flatMap((order) => order.itemsOrdered);
  let itemMap:Map<string,number> = new Map<string,number>();
  itemOrdered.forEach((item) => {
  const name = item.name;
  const currentCount = itemMap.get(name) || 0;
  itemMap.set(name, currentCount + 1);
})
const labels = Array.from(itemMap.keys());       
const dataPie = Array.from(itemMap.values());   

return {labels,dataPie}
}