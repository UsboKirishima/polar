import { authService, userService } from '@polar/services'
import { loginInfoSchema, userSchema } from '@polar/types'
import { generateTokens } from '@polar/utils'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'

import { protectedProcedure, publicProcedure, t } from '../trpc.js'

export const authRouter = t.router({
    register: publicProcedure
        .input(userSchema)
        .mutation(async ({ input }) => {
            try {
                const existingUser = await userService.findUserByEmail(
                    input.email,
                )
                if (existingUser) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Email address already in use.',
                    })
                }

                const user = await userService.createUserWithProfile({
                    email: input.email,
                    password: input.password,
                    profile: {
                        username: input.profile.username,
                        dateOfBirth: input.profile.dateOfBirth,
                        fullName: input.profile.fullName,
                    },
                })

                const { accessToken, refreshToken } = generateTokens(user)
                await authService.addRefreshTokenToWhitelist({
                    refreshToken,
                    userId: user.id,
                })

                return { accessToken, refreshToken }
            }
            catch (error: any) {
                if (error instanceof TRPCError)
                    throw error
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error?.message ?? 'Failed to signup',
                })
            }
        }),
    login: publicProcedure
        .input(loginInfoSchema)
        .mutation(async ({ input }) => {
            try {
                const existingUser = await userService.findUserByEmail(
                    input.email,
                )
                if (!existingUser) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'User not found',
                    })
                }

                const validPassword = await bcrypt.compare(
                    input.password,
                    existingUser.password,
                )
                if (!validPassword) {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'Authentication failed.',
                    })
                }

                const { accessToken, refreshToken }
                    = generateTokens(existingUser)
                await authService.addRefreshTokenToWhitelist({
                    refreshToken,
                    userId: existingUser.id,
                })

                return { accessToken, refreshToken }
            }
            catch (error: any) {
                if (error instanceof TRPCError)
                    throw error
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error?.message ?? 'Authentication failed.',
                })
            }
        }),
    ping: protectedProcedure.query(async () => {
        try {
            return { message: 'Pong' }
        }
        catch (error: any) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error?.message ?? 'Failed to ping server',
            })
        }
    }),
})
