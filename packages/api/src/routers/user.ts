import { protectedProcedure, t } from "../trpc";
import { z } from 'zod/v4';
import { profileSchema, userIdSchema, usernameSchema } from "@polar/types/zod";
import { resultErr, resultOk } from "@polar/utils";
import { uploadMedia } from "@polar/media";

import { userService } from "@polar/services";
import { postService } from "@polar/services";
import { bannerService } from "@polar/services";
import { avatarService } from "@polar/services";

import type { Express } from "express";

export const fileSchema = z.custom<Express.Multer.File>(
    (val) => val && typeof val === "object" && "buffer" in val && "mimetype" in val,
    { message: "Invalid file upload" }
);

function removePassword<T extends Record<string, any>>(obj: T): Omit<T, 'password'> {
    const newObj = { ...obj };

    if ('password' in newObj) {
        delete newObj.password;
    }

    return newObj as Omit<T, 'password'>;
}

export const userRouter = t.router({
    getMe: protectedProcedure
        .query(async ({ ctx }) => {
            const user = await userService.findUserAndProfileById(ctx.user.userId);

            if (!user)
                return resultErr(`User not found: ${ctx.user.userId}`);

            return removePassword(user);
        }),
    search: protectedProcedure
        .input(z.string())
        .query(async ({ input, ctx }) => {
            const usersMatch = await userService.searchUsers(input);

            if (!usersMatch.length) return resultOk('No users found');

            return usersMatch.map((u: any) => removePassword(u));
        }),
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            const users = await userService.getAllUsers();

            return users;
        }),
    getById: protectedProcedure
        .input(userIdSchema)
        .query(async ({ input }) => {
            const user = await userService.findUserAndProfileById(input);

            if (!user)
                return resultErr(`User not found: ${input}`);

            return removePassword(user);
        }),
    getByUsername: protectedProcedure
        .input(usernameSchema)
        .query(async ({ input }) => {
            const user = await userService.findUserAndProfileByUsername(input);

            if (!user)
                return resultErr(`User not found: ${input}`);

            return removePassword(user);
        }),
    getFriends: protectedProcedure
        .input(userIdSchema)
        .query(async ({ input, ctx }) => {
            const friends = await userService.findAllFriendsByUserId(input);

            if (!friends)
                return resultErr(`Failed to retrieve friends for user ID: ${input}`);

            const safeFriends = friends.friends.map((friend: any) => removePassword(friend));

            return safeFriends;
        }),
    getPosts: protectedProcedure
        .input(userIdSchema)
        .query(async ({ input, ctx }) => {
            const posts = await postService.getPostsByUserId(input);

            return posts;
        }),
    setAvatar: protectedProcedure
        .input(fileSchema.nullable())
        .mutation(async ({ input, ctx }) => {

            if (input === null) {
                avatarService.deleteAvatar(ctx.user.userId);
                return resultOk('Successfully remove avatar.')
            }

            const data = await uploadMedia('avatars', input, ctx.user.userId);

            if ('avatar' in data) {
                return data;
            }

            return resultErr('Failed to upload avatar');
        }),
    setBanner: protectedProcedure
        .input(fileSchema.nullable())
        .mutation(async ({ input, ctx }) => {
            if (input === null) {
                bannerService.deleteBanner(ctx.user.userId);
                return resultOk('Successfully remove banner.')
            }

            const data = await uploadMedia('banners', input, ctx.user.userId);

            if ('banner' in data) {
                return data;
            }

            return resultErr('Failed to upload banner');
        }),
    edit: protectedProcedure
        .input(profileSchema.partial())
        .mutation(async ({ input, ctx }) => {

            const profile = await userService.getProfileByUserId(ctx.user.userId);

            if (!profile || !profile.profile) {
                return resultErr(`Failed to modify information for user ${ctx.user.userId}`)
            }

            await userService.updateProfileById(profile.profile.id, input);
            return resultOk(`Successfully update information for ${ctx.user.userId}`);
        })
});
