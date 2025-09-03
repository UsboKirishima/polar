import { z } from "zod";


// ------------------- User Schema Login ------------------- 

const userBaseSchema = {
    email: z.string().email({ message: 'invalid email address' }),
    password: z.string().min(8, { message: 'password must be at least 8 characters long' }).max(50, {
        message: 'password cannot be longer than 50 characters',
    }),
    profileId: z.string().nullable().optional(),
    profile: z.object({
        username: z.string().min(4, { message: 'username must be at least 4 characters long' }).max(20, {
            message: 'username cannot be longer than 20 characters'
        }).nullable().optional(),
        dateOfBirth: z.coerce.date().min(new Date('01/01/1900'), { message: 'invalid date of birth' }).max(new Date(Date.now()), {
            message: 'Invalid date of birth'
        }).nullable().optional(),
        fullName: z.string().max(50, { message: 'full name cannot be longer than 50 characters' }).nullable().optional()
    }).nullable().optional()
};

export const userSchema = z.object(userBaseSchema);
export const profileSchema = userBaseSchema.profile;


const userBasic = {
    email: z.string().email({ message: 'invalid email address' }),
    password: z.string().min(8, { message: 'password must be at least 8 characters long' }).max(50, {
        message: 'password cannot be longer than 50 characters',
    })
}

export const userBasicSchema = z.object(userBasic);

// ------------------- Export types -------------------

export type TUserSchema = z.infer<typeof userSchema>;