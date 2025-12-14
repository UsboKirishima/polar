import type { Express } from 'express'

import { uploadMedia } from '@polar/media'
import {
    avatarService,
    bannerService,
    postService,
    userService,
} from '@polar/services'
import { profileSchema, userIdSchema, usernameSchema } from '@polar/types/zod'
import { TRPCError } from '@trpc/server'
import { z } from 'zod/v4'

import { protectedProcedure, t } from '../trpc.js'

export const fileSchema = z.custom<Express.Multer.File>(
    val =>
        val && typeof val === 'object' && 'buffer' in val && 'mimetype' in val,
    { message: 'Invalid file upload' }
)

function removePassword<T extends Record<string, any>>(
    obj: T
): Omit<T, 'password'> {
    const newObj = { ...obj }
    delete (newObj as any).password
    return newObj as Omit<T, 'password'>
}

export const userRouter = t.router({
    getMe: protectedProcedure.query(async ({ ctx }) => {
        try {
            const user = await userService.findUserAndProfileById(
                ctx.user.userId
            )
            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `User not found: ${ctx.user.userId}`,
                })
            }

            return removePassword(user)
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch user profile.',
                cause: error,
            })
        }
    }),

    search: protectedProcedure.input(z.string()).query(async ({ input }) => {
        try {
            const usersMatch = await userService.searchUsers(input)
            return usersMatch.map((u: any) => removePassword(u))
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to search users.',
                cause: error,
            })
        }
    }),

    getAll: protectedProcedure.query(async () => {
        try {
            return await userService.getAllUsers()
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch users.',
                cause: error,
            })
        }
    }),

    getById: protectedProcedure.input(userIdSchema).query(async ({ input }) => {
        try {
            const user = await userService.findUserAndProfileById(input)
            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `User not found: ${input}`,
                })
            }
            return removePassword(user)
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch user by ID.',
                cause: error,
            })
        }
    }),

    getByUsername: protectedProcedure
        .input(usernameSchema)
        .query(async ({ input }) => {
            try {
                const user =
                    await userService.findUserAndProfileByUsername(input)
                if (!user) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: `User not found: ${input}`,
                    })
                }
                return removePassword(user)
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to fetch user by username.',
                    cause: error,
                })
            }
        }),

    getFriends: protectedProcedure
        .input(userIdSchema)
        .query(async ({ input }) => {
            try {
                const friends = await userService.findAllFriendsByUserId(input)
                if (!friends) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: `Failed to retrieve friends for user ID: ${input}`,
                    })
                }

                return friends.friends.map((friend: any) =>
                    removePassword(friend)
                )
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to fetch user friends.',
                    cause: error,
                })
            }
        }),

    getPosts: protectedProcedure
        .input(userIdSchema)
        .query(async ({ input }) => {
            try {
                return await postService.getPostsByUserId(input)
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to fetch user posts.',
                    cause: error,
                })
            }
        }),

    setAvatar: protectedProcedure
        .input(fileSchema.nullable())
        .mutation(async ({ input, ctx }) => {
            try {
                if (input === null) {
                    await avatarService.deleteAvatar(ctx.user.userId)
                    return { message: 'Successfully removed avatar.' }
                }

                const data = await uploadMedia(
                    'avatars',
                    input,
                    ctx.user.userId
                )
                if (!('avatar' in data)) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Failed to upload avatar.',
                    })
                }

                return data
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to set avatar.',
                    cause: error,
                })
            }
        }),

    setBanner: protectedProcedure
        .input(fileSchema.nullable())
        .mutation(async ({ input, ctx }) => {
            try {
                if (input === null) {
                    await bannerService.deleteBanner(ctx.user.userId)
                    return { message: 'Successfully removed banner.' }
                }

                const data = await uploadMedia(
                    'banners',
                    input,
                    ctx.user.userId
                )
                if (!('banner' in data)) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Failed to upload banner.',
                    })
                }

                return data
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to set banner.',
                    cause: error,
                })
            }
        }),

    edit: protectedProcedure
        .input(profileSchema.partial())
        .mutation(async ({ input, ctx }) => {
            try {
                const profile = await userService.getProfileByUserId(
                    ctx.user.userId
                )
                if (!profile || !profile.profile) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: `Failed to modify information for user ${ctx.user.userId}`,
                    })
                }

                await userService.updateProfileById(profile.profile.id, input)
                return {
                    message: `Successfully updated profile for ${ctx.user.userId}`,
                }
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to edit profile.',
                    cause: error,
                })
            }
        }),
})
