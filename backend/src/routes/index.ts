import express from "express";

import type MessageResponse from "../interfaces/message-response.js";

import auth from './auth.router.js'
import users from './users.router.js'
import friends from './friends.router.js'
import posts from './posts.router.js'
import categories from './categories.router.js'

const router = express.Router();

router.get<object, MessageResponse>("/", (req, res) => {
    res.json({
        message: "API - 👋🌎🌍🌏",
    });
});

router.use('/auth', auth);
router.use('/users', users);
router.use('/friends', friends);
router.use('/posts', posts);
router.use('/categories', categories);

export default router;
