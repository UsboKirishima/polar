import { Router } from 'express'

import * as friendController from '../controllers/friends.controller'
import { isAuthenticated } from '../middlewares.js'

const router = Router()

// POST /friends/request -> send a new friend request
router.post('/request', isAuthenticated, friendController.createFriendRequest)

// POST /friends/accept -> accept a friend request
router.post('/accept', isAuthenticated, friendController.acceptFriendRequest)

// POST /friends/remove -> Remove friend
router.post('/remove', isAuthenticated, friendController.removeFriendship)

// POST /friends/deny -> reject a friend request
router.post('/deny', isAuthenticated, friendController.denyFriendRequest)

// GET /friends/requests -> get pending friend requests
router.get(
    '/requests',
    isAuthenticated,
    friendController.getAllPendingFriendRequests
)

// GET /friends -> get a user's friends
router.get('/', isAuthenticated, friendController.getAllFriendsByUserId)

export default router
