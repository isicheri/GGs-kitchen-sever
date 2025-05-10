import { PaidType } from "../../../../generated/prisma";
import prismaClient from "../../../utils/prismaClient/prismaClent";


export async function findManyQuery<T extends string,Q extends string | number>(table:T,query:Q) {
  switch (table) {
      case "order":
      const orders = await prismaClient.order.findMany({where: {
        paid: query as PaidType
      },include: {itemsOrdered: true}})
      return orders;
    default:
      return null;
  }
}

export async function findOneQuery<T extends string,Q extends string | number>(table:T,query:Q) {}
