import {Request} from "express";
import {genSaltSync, hashSync} from "bcrypt";
import prismaClient from "../../../utils/prismaClient/prismaClent";
import { Iuser } from "../Dto/uset.dto";
import { User, UserType } from "../../../../generated/prisma";
import { constants } from "node:fs/promises";

export const createUser = async(data: {username: string,password:string}):Promise<Iuser | null> => {
   const hashedPassword = hashSync(data.password,genSaltSync(14));
   const user = await prismaClient.user.create({
    data: {
      username:data.username,
      password: hashedPassword
    }
   })
    return user
} 
export const getUser = async(data: {username: string}):Promise<Iuser|null > => {
const user = prismaClient.user.findFirst({where: {username: data.username}})
return user;
}
export const getAllUsers = async():Promise<{id: string,username: string,userType: UserType}[]>  => {
  const allUsers = await prismaClient.user.findMany({ select: {id: true,username: true,userType: true},where: {userType: "SELLER"} });
  return allUsers;
}
export const getUserById = async(id: string):Promise<User | null> => {
  const user = await prismaClient.user.findFirst({where: {id: id}});
  return user
}