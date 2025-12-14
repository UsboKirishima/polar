import { Router } from 'express'

import * as postController from '../controllers/posts.controller'
import { isAuthenticated } from '../middlewares.js'

const router = Router()

/**
 * POSTS ROUTES
 */
router.post('/new', isAuthenticated, postController.createPost) // Create a post
router.delete('/:postId', isAuthenticated, postController.deletePost) // Delete a post
router.post('/:postId/like', isAuthenticated, postController.likePost) // Like/Unlike a post

/**
 * COMMENTS ROUTES
 */
router.post('/:postId/comment', isAuthenticated, postController.addComment) // Add comment to a post
router.delete(
    '/comment/:commentId',
    isAuthenticated,
    postController.deleteComment
) // Delete comment

/**
 * GET ROUTES
 */
router.get('/:postId', isAuthenticated, postController.getPostById) // Get single post
router.get('/user/:userId', isAuthenticated, postController.getPostsByUserId) // Get all posts by a user
router.get('/', isAuthenticated, postController.getAllPosts) // Get all posts

export default router
