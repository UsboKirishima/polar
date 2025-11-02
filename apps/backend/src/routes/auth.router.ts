import type { TUserSchema } from '@polar/types'

import * as services from '@polar/services'
import bcrypt from 'bcrypt'
import express from 'express'

import { generateTokens } from '../utils/jwt.js'

const router = express.Router()

// -------------------- REGISTER --------------------
router.post('/register', async (req, res, next) => {
    try {
        const userRequest: TUserSchema = req.body

        if (!userRequest.email || !userRequest.password) {
            res.status(400)
            throw new Error('You must provide an email and a password.')
        }

        // Check if use already exists
        const existingUser = await services.userService.findUserByEmail(
            userRequest.email
        )
        if (existingUser) {
            res.status(400)
            throw new Error('Email already in use.')
        }

        // User creation with nested profile
        const user = await services.userService.createUserWithProfile({
            email: userRequest.email,
            password: userRequest.password,
            profile: {
                username: userRequest.profile.username,
                dateOfBirth: userRequest.profile.dateOfBirth,
                fullName: userRequest.profile.fullName,
            },
        })

        // Token generation
        const { accessToken, refreshToken } = generateTokens(user)
        await services.authService.addRefreshTokenToWhitelist({
            refreshToken,
            userId: user.id,
        })

        res.json({ accessToken, refreshToken })
    } catch (err) {
        next(err)
    }
})

// -------------------- LOGIN --------------------
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400)
            throw new Error('You must provide an email and a password.')
        }

        const existingUser = await services.userService.findUserByEmail(email)
        if (!existingUser) {
            res.status(403)
            throw new Error('Invalid login credentials.')
        }

        const validPassword = await bcrypt.compare(
            password,
            existingUser.password
        )
        if (!validPassword) {
            res.status(403)
            throw new Error('Invalid login credentials.')
        }

        const { accessToken, refreshToken } = generateTokens(existingUser)
        await services.authService.addRefreshTokenToWhitelist({
            refreshToken,
            userId: existingUser.id,
        })

        res.json({ accessToken, refreshToken })
    } catch (err) {
        next(err)
    }
})

// -------------------- REFRESH TOKEN --------------------
router.post('/refreshToken', async (req, res, next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            res.status(400)
            throw new Error('Missing refresh token.')
        }

        const savedRefreshToken =
            await services.authService.findRefreshToken(refreshToken)
        if (
            !savedRefreshToken ||
            savedRefreshToken.revoked === true ||
            Date.now() >= savedRefreshToken.expireAt.getTime()
        ) {
            res.status(401)
            throw new Error('Unauthorized')
        }

        const user = await services.userService.findUserById(
            savedRefreshToken.userId
        )
        if (!user) {
            res.status(401)
            throw new Error('Unauthorized')
        }

        await services.authService.deleteRefreshTokenById(savedRefreshToken.id)
        const { accessToken, refreshToken: newRefreshToken } =
            generateTokens(user)
        await services.authService.addRefreshTokenToWhitelist({
            refreshToken: newRefreshToken,
            userId: user.id,
        })

        res.json({ accessToken, refreshToken: newRefreshToken })
    } catch (err) {
        next(err)
    }
})

// -------------------- REVOKE TOKENS --------------------
router.post('/revokeRefreshTokens', async (req, res, next) => {
    try {
        const { userId } = req.body
        await services.authService.revokeTokens(userId)
        res.json({ message: `Tokens revoked for user with id #${userId}` })
    } catch (err) {
        next(err)
    }
})

export default router
