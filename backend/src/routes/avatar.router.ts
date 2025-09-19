import { Router } from "express";
import multer from "multer";

import * as avatarController from "../controllers/avatar.controller";
import { isAuthenticated } from "../middlewares.js";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

const uploadMiddlerwares = [isAuthenticated, upload.single("avatar")];

// GET /avatar -> Get user requester avatar (Auth required)
router.get("/", isAuthenticated, avatarController.getUserAvatar);

// POST /avatar -> Upload requester avatar (Auth required)
router.post("/", uploadMiddlerwares, avatarController.uploadAvatar);

// DELETE /avatar -> Remove the requester avatar (Auth required)
router.delete("/", isAuthenticated, avatarController.deleteUserAvatar);

/**
 * ======================== ALL USERS ========================
 */

// GET /avatar/:userId -> Get avatar by given user id
router.get("/:userId", avatarController.getAvatarByUserId);

export default router;

