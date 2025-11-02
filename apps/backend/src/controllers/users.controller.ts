import type { TUserId, TUsername } from '@polar/types'
import type { NextFunction, Request, Response } from 'express'

import * as services from '@polar/services'
import * as types from '@polar/types'

function validateUserId(res: Response, userId: string) {
    const validationResult = types.userIdSchema.safeParse(userId)
    if (!validationResult.success) {
        res.status(400).json({
            message: 'Invalid user ID',
            errors: validationResult.error.errors,
        })
        return
    }
    return validationResult.data
}

// -------------------- GET USER BY ID --------------------
export async function getUserById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.params.id
        if (!userId) {
            res.status(400).json({ error: 'User ID is required' })
            return
        }
        const parsedUserId = validateUserId(res, userId)
        if (!parsedUserId) return

        const user =
            await services.userService.findUserAndProfileById(parsedUserId)
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }

        const { password, ...userWithoutPassword } = user
        res.json(userWithoutPassword)
    } catch (err) {
        next(err)
    }
}

// -------------------- GET USER BY USERNAME --------------------
export async function getUserByUsername(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const username = req.params.username
        if (!username) {
            res.status(400).json({ error: 'Username is required' })
            return
        }

        if (!username) {
            res.status(400).json({ error: 'username is required' })
            return
        }

        const user =
            await services.userService.findUserAndProfileByUsername(username)
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }

        const { password, ...userWithoutPassword } = user
        res.json(userWithoutPassword)
    } catch (err) {
        next(err)
    }
}

// -------------------- MODIFY USERNAME --------------------
export async function modifyUsername(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.params.id
        if (!userId) {
            res.status(400).json({ error: 'User ID is required' })
            return
        }
        const usernameData: TUsername = req.body.username

        const parsedUsername = types.usernameSchema.parse(usernameData)
        const parsedUserId = validateUserId(res, userId)
        if (!parsedUserId) return

        const user = await services.userService.findUserAndProfileById(userId)
        if (!user?.profile) {
            res.status(404).json({
                message: 'This user has no associated profile',
            })
            return
        }

        await services.userService.updateProfileById(user.profile.id, {
            username: parsedUsername,
        })
        res.status(200).json({ message: 'Username updated successfully' })
    } catch (err) {
        next(err)
    }
}

// -------------------- GET ALL FRIENDS -------------------
export async function getAllFriends(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.params.id
        if (!userId) {
            res.status(400).json({ error: 'User ID is required' })
            return
        }
        const user = await services.userService.findAllFriendsByUserId(userId)

        if (!user) {
            res.status(404).json({ message: 'user not found' })
            return
        }

        const friendsOnly = user.friends
        res.status(200).json(friendsOnly)
    } catch (err) {
        next(err)
    }
}

// -------------------- GET ALL USERS --------------------
export async function getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const users = await services.userService.getAllUsers()
        res.status(200).json(users)
    } catch (err) {
        next(err)
    }
}
