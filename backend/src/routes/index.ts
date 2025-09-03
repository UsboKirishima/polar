import express from "express";

import type MessageResponse from "../interfaces/message-response.js";

import auth from './auth.router.js'
import users from './users.router.js'

const router = express.Router();

router.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use('/auth', auth);
router.use('/users', users);

export default router;
