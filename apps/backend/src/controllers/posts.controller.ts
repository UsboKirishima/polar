import type { NextFunction, Request, Response } from "express";

import { postService } from "@polar/services";
import { commentSchema, postSchema, userIdSchema } from "@polar/types/zod.js";

/**
 * Create a new post
 */
export async function createPost(req: Request, res: Response, next: NextFunction) {
    try {
        const authorId = req.payload?.userId;
        if (!authorId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { text, categories } = postSchema.parse(req.body);
        const post = await postService.createNewPost(authorId, { text, categories }, categories);

        res.status(201).json({ message: "Post created successfully", post });
    }
    catch (err) {
        next(err);
    }
}

/**
 * Delete a post (only author can delete)
 */
export async function deletePost(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.payload?.userId;
        const { postId } = req.params;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const post = await postService.getPostByid(postId);
        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        if (post.authorId !== userId) {
            res.status(403).json({ error: "You are not allowed to delete this post" });
            return;
        }

        await postService.deletePost(postId);
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (err) {
        next(err);
    }
}

/**
 * Like or unlike a post
 */
export async function likePost(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.payload?.userId;
        const { postId } = req.params;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const like = await postService.likePost(postId, userId);
        res.status(200).json({ message: "Post like toggled successfully", like });
    }
    catch (err) {
        next(err);
    }
}

/**
 * Add a comment to a post
 */
export async function addComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { postId } = req.params;
        const { text } = commentSchema.parse(req.body);
        const userId = req.payload?.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const comment = await postService.createNewComment(userId, { text }, postId);
        res.status(201).json({ message: "Comment added successfully", comment });
    }
    catch (err) {
        next(err);
    }
}

/**
 * Delete a comment (only author of comment can delete)
 */
export async function deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.payload?.userId;
        const { commentId } = req.params;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const comment = await postService.getCommentById(commentId);
        if (!comment) {
            res.status(404).json({ error: "Comment not found" });
            return;
        }

        if (comment.userId !== userId) {
            res.status(403).json({ error: "You are not allowed to delete this comment" });
            return;
        }

        await postService.deleteComment(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (err) {
        next(err);
    }
}

/**
 * Get a single post
 */
export async function getPostById(req: Request, res: Response, next: NextFunction) {
    try {
        const { postId } = req.params;
        const post = await postService.getPostByid(postId);

        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        res.status(200).json(post);
    }
    catch (err) {
        next(err);
    }
}

/**
 * Get all posts by a user
 */
export async function getPostsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.params;
        const posts = await postService.getPostsByUserId(userId);
        res.status(200).json(posts);
    }
    catch (err) {
        next(err);
    }
}

/**
 * Get all posts
 */
export async function getAllPosts(_req: Request, res: Response, next: NextFunction) {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json(posts);
    }
    catch (err) {
        next(err);
    }
}

/**
 * Get all categories
 */
export async function getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await postService.getAllCategories();
        res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
}

export async function getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
        const categoryId = Number(req.params.categoryId);

        if (isNaN(categoryId) || categoryId <= 0) {
            res.status(400).json({ message: 'Invalid category ID' });
            return;
        }

        const category = await postService.getCategoryById(categoryId);

        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
}

export async function getCategoryByName(req: Request, res: Response, next: NextFunction) {
    try {
        const categoryName = req.params.categoryName?.trim();

        if (!categoryName) {
            res.status(400).json({ message: 'Category name is required' });
            return;
        }

        const category = await postService.getCategoryByName(categoryName);

        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
}
