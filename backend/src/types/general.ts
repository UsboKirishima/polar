import { Profile } from "../generated/prisma";
import { TUserSchema } from "./zod";

export type SimpleUserSchema = Omit<TUserSchema, 'profile'>;
export type SimpleProfileSchema = Omit<Partial<Profile>, 'id' | 'User'> | null | undefined;