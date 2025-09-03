import { z } from "zod";


// ------------------- User Schema Login ------------------- 

const userBaseSchema = {
    email: z.string().email({ message: 'invalid email address'}),
    password: z.string().min(8, { message: 'password must be at least 8 characters long' }).max(50, {
        message: 'password cannot be longer than 50 characters',
    }),
};

export const userSchema = z.object(userBaseSchema);

// ------------------- Export types -------------------

export type TUserSchema = z.infer<typeof userSchema>;