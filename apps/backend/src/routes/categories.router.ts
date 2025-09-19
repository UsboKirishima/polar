import { Router } from "express";
import { isAuthenticated } from "../middlewares";
import * as PostController from '../controllers/posts.controller';

const router = Router();

// GET /categories -> Get all categories
router.get('/', isAuthenticated, PostController.getAllCategories);

// GET /categories/:categoryId -> Get category by given id
router.get('/:categoryId', isAuthenticated, PostController.getCategoryById);

// GET /categories/n/:categoryName -> Get category by given category name
router.get('/n/:categoryName', isAuthenticated, PostController.getCategoryByName);

export default router;