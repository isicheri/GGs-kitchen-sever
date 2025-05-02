import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string(),
    password: z.string().max(8,"Password cannot be more than 8 characters long")
})

export const GetUserSchema = z.object({
    username: z.string(),
    password: z.string()
})