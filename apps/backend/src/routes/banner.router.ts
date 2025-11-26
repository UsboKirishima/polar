import { Router } from 'express'
import multer from 'multer'

import * as bannerController from '../controllers/banner.controller'
import { isAuthenticated } from '../middlewares.js'

const router = Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

/**
 * SECURITY WARNING
 * =================
 * Some of these operations does not requires the `isAuthenticated` middleware
 * just because we wanna serve avatars and banners indipendently from the auth.
 * Authentication is required just in the routes descripted with methods POST, DELETE.
 */

/**
 * ======================== CURRENT USER ========================
 */

const uploadMiddlerwares = [isAuthenticated, upload.single('banner')]

// GET /banner -> Get user requester banner (Auth required)
router.get('/', isAuthenticated, bannerController.getUserBanner)

// POST /banner -> Upload requester banner (Auth required)
router.post('/', uploadMiddlerwares, bannerController.uploadBanner)

// DELETE /banner -> Remove the requester banner (Auth required)
router.delete('/', isAuthenticated, bannerController.deleteUserBanner)

/**
 * ======================== ALL USERS ========================
 */

// GET /banner/:userId -> Get banner by given user id
router.get('/:userId', bannerController.getBannerByUserId)

export default router
