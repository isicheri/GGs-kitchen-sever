import {Request} from "express";
import {genSaltSync, hashSync} from "bcrypt";
import prismaClient from "../../../utils/prismaClient/prismaClent";
import { Iuser } from "../Dto/uset.dto";


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

