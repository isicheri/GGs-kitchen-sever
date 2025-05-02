import { User } from "../../../generated/prisma"

export type Iuser = Pick<User,"id" | "username" | "userType" | "password">;

export type IUserJwt = Pick<User,"id" | "username" | "userType">;