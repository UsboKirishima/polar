import { protectedProcedure, publicProcedure, t } from "../trpc";
import { z } from 'zod/v4';
import { userIdSchema, usernameSchema } from "../../types/zod";
import { findAllFriendsByUserId, findUserAndProfileById, findUserAndProfileByUsername, getAllUsers } from "../../services/users.service";
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
    getAllFriendsById: protectedProcedure
        .input(userIdSchema)
        .query(async ({ input, ctx }) => {
            const friends = await findAllFriendsByUserId(input);

            if (!friends)
                return resultErr(`Failed to retrieve friends for user ID: ${input}`);

            const safeFriends = friends.friends.map(friend => removePassword(friend));

            return safeFriends;
        }),
    getAllUsers: protectedProcedure
        .query(async ({ ctx }) => {
            const users = await getAllUsers();

            return users;
        })
})