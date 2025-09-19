import { Profile } from "../generated/prisma";
import { TProfileSchema, TUserSchema } from "./zod";

export type SimpleUserSchema = TUserSchema;
export type SimpleProfileSchema = TProfileSchema;