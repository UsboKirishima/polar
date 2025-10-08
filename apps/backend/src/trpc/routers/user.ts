import { protectedProcedure, publicProcedure, t } from "../trpc";
import { z } from 'zod/v4';
import { userIdSchema, usernameSchema } from "../../types/zod";
import { findUserAndProfileById, findUserAndProfileByUsername } from "../../services/users.service";
import { resultErr } from "../../utils/response";

function removePassword<T extends Record<string, any>>(obj: T): Omit<T, 'password'> {
    const newObj = { ...obj };

    if ('password' in newObj) {
        delete newObj.password;
    }

    return newObj as Omit<T, 'password'>;
}

export const userRouter = t.router({
    getById: protectedProcedure
        .input(userIdSchema)
        .query(async ({ input }) => {
            const user = await findUserAndProfileById(input);

            if (!user)
                return resultErr(`User not found: ${input}`);

            return removePassword(user);
        }),
    getByUsername: protectedProcedure
        .input(usernameSchema)
        .query(async ({ input }) => {
            const user = await findUserAndProfileByUsername(input);

            if (!user)
                return resultErr(`User not found: ${input}`);

            return removePassword(user);
        }),
    modifyUsername: protectedProcedure
        .input(usernameSchema)
        .query(({ input }) => {

        })
})