import { Request,Response } from "express";
import { getAllCompletedOrder, getMonthlySalesAndCompare, getMostOrderedPieItem, getSalesGraphOrder, getTodaysSalesAndCompare, getTodayTotalOrders, getTotalOrderOfTheWeeks } from "../../order/controller/order.controller";
import { createUser, getAllUsers, getUser, getUserById } from "../service/user.service";
import { BadRequest } from "../../../utils/Errors/badRequestError/badRequest";
import prismaClient from "../../../utils/prismaClient/prismaClent";
import { CreateUserSchema } from "../../auth/validation/auth.validaton";

export const getDashboard = async (req:Request,res: Response) => {
  try {
     const {lastWeekCount,thisWeekCount,percentChange} = await getTotalOrderOfTheWeeks();
    const {todaysOrderCount} = await getTodayTotalOrders();
    const {todayTotalPrice,percentChangeOfTotalPrice} = await getTodaysSalesAndCompare();
    const {percentChangeOfTotalPriceMonthly,thisMonthTotalPrice} = await getMonthlySalesAndCompare()
    const graphData = await getSalesGraphOrder();
    const commpletedOrder = await getAllCompletedOrder();
    const pieData = await getMostOrderedPieItem();
    res.render("admindashboard",{
        user: req.user,
        lastWeekCount: lastWeekCount,
        thisWeekCount: thisWeekCount,
        percentChange: percentChange,
        todaysOrderCount: todaysOrderCount,
        todayTotalPrice: todayTotalPrice,
        percentChangeOfTotalPrice: percentChangeOfTotalPrice,
        thisMonthTotalPrice:thisMonthTotalPrice,
        percentChangeOfTotalPriceMonthly: percentChangeOfTotalPriceMonthly,
        commpletedOrder: commpletedOrder,
        graphData:graphData,
        pieChartData: {
          lebels: pieData.labels,
          data: pieData.dataPie
        },
        currentPath: req.path
    })
  } catch (error) {
    res.redirect("/");
  }
}

export const renderOrders = (req: Request, res: Response) => {
  res.render("orders", {
    user: req.user,
    currentPath: req.path
  });
};

export const renderNewOrders = (req: Request, res: Response) => {
  res.render("new-orders", {
    user: req.user,
    currentPath: req.path
  });
};

export const renderSettings = async (req: Request, res: Response) => {
  res.render("settings", {
    user: req.user,
    currentPath: req.path
  });
};


//api-call-routes
export const getUsersAdmin = async (req:Request,res:Response) => {
  const users = await getAllUsers();
  res.status(200).json({
    success: true,
    data: users
  })
}

export const deleteUser = async(req:Request,res:Response) => {
  const userId = req.params.userId;
  let user = await getUserById(userId);
  if(!user) {
    throw new BadRequest("User not found",null);
  }
  await prismaClient.user.delete({where: {id: user.id}});
  res.status(200).json({
    success: true,
    message: "user deleted successfully"
  })
}

export const createUserAdmin = async(req:Request,res:Response) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if(!parsedData.success) {
      throw new BadRequest(parsedData.error.message,parsedData.error)
  }
  const findUser = await getUser({username: parsedData.data.username})
  if(findUser) {
      throw new BadRequest("user name already exist",null);
  }
  const user = await createUser(parsedData.data);
  res.status(201).json({
  message: "user created successfully",
  success: true,
  data: {
      user: {username: user?.username,type:user?.userType}
  }
  })
}