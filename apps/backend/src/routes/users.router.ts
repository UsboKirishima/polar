import type { NextFunction, Response } from 'express'

import * as services from '@polar/services'
import { Router } from 'express'

import type { AuthenticatedRequest } from '../middlewares.js'

import * as UsersController from '../controllers/users.controller.js'
import { isAuthenticated } from '../middlewares.js'

const router = Router()

router.get(
    '/profile',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.payload!
            const user = await services.userService.findUserById(userId)

            if (!user) {
                res.status(404).json({ message: 'User not found' })
                return
            }

            const { password, ...safeUser } = user
            res.json(safeUser)
        } catch (err) {
            next(err)
        }
    }
)

// Gets
router.get('/', isAuthenticated, UsersController.getAllUsers) // Returns all the users id, avatars and usernames
router.get('/:id', isAuthenticated, UsersController.getUserById)
router.get('/:id/friends', isAuthenticated, UsersController.getAllFriends)
router.get('/u/:username', isAuthenticated, UsersController.getUserByUsername)

// Profile settings
router.patch('/:id/username', isAuthenticated, UsersController.modifyUsername)

export default router
