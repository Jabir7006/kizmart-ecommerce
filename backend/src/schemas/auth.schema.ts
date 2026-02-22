import { z } from "zod";
import { ROLES } from "../models/user.model.js";


export const signupSchema = z.object({
    body : z.object({
       fullName : z.string({ error: "Full name is required" }).min(3, { error: "Full name must be at least 3 characters long" }), 
       email : z.email({ error: "Invalid email" }), 
       password : z.string({ error: "Password is required" }).min(6, { error: "Password must be at least 6 characters long" }), 
       role : z.enum(ROLES).default("user"),
       verified : z.boolean().default(false),
       createdAt : z.date().default(() => new Date()),
       updatedAt : z.date().default(() => new Date()),
    })
})

