import * as userService from "../../services/users.service";
import * as postService from "../../services/posts.service";
import * as bannerService from "../../services/banner.service";
import * as avatarService from "../../services/avatar.service";
import { protectedProcedure, t } from "../trpc";
import { commentEditSchema, commentIdSchema, commentRequestSchema, commentSchema, postIdSchema, postSchema, updatePostSchema } from "../../types/zod";
import { internalErr, resultErr, resultOk } from "../../utils/response";
import { userRouter } from "./user";

async function isUserThePostAuthor(userId: string, postId: string): Promise<boolean> {
    const userPosts = await postService.getPostsByUserId(userId);
    return userPosts.some(post => post.id === postId);
}


export const postRouter = t.router({
    getById: protectedProcedure
        .input(postIdSchema)
        .query(async ({ input, ctx }) => {
            try {
                const post = await postService.getPostByid(input);

                if (!post)
                    return resultErr('Failed to find post.');

                return post;
            } catch (error) {
                return internalErr();
            }
        }),
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                return await postService.getAllPosts();
            } catch (error) {
                return internalErr();
            }
        }),
    getFeed: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                /**
                 * Feed
                 * =========================
                 * This section is made for Feed suggesting and pagination.
                 * Each page has a N posts, and there are at least 1 or more
                 * pages.
                 * The result to be sent by this route is evaluated by the polar
                 * algorithm (Not implemented yet).
                 */

                return await postService.getAllPosts();
            } catch (error) {
                return internalErr();
            }
        }),
    create: protectedProcedure
        .input(postSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const newPost = await postService.createNewPost(ctx.user.userId, {
                    text: input.text,
                    categories: input.categories
                }, input.categories);

                return newPost;
            } catch (error) {
                return internalErr();
            }
        }),
    edit: protectedProcedure
        .input(updatePostSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                if (!(await isUserThePostAuthor(ctx.user.userId, input.postId))) {
                    return resultErr(`You can't update someone else post`);
                }

                const updatedPost = await postService.updatePost(input.postId, input.post);

                if (!updatedPost)
                    return resultErr(`Failed to update post`);

                return updatedPost;
            } catch (error) {
                return internalErr();
            }
        }),
    delete: protectedProcedure
        .input(postIdSchema)
        .mutation(async ({ input, ctx }) => {
            try {

                if (!(await isUserThePostAuthor(ctx.user.userId, input))) {
                    return resultErr(`You can't delete someone else post`);
                }

                await postService.deletePost(input);
                return resultOk(`Post with id (${input}) was successfully deleted.`);
            } catch (error) {
                return internalErr();
            }
        }),
    toggleLike: protectedProcedure
        .input(postIdSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                await postService.likePost(input, ctx.user.userId);
                return resultOk(`Post liked/unliked successfully`);
            } catch (error) {
                return internalErr();
            }
        }),
    toggleSave: protectedProcedure
        .input(postIdSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                /**
                 * !!! WARNING - NOT IMPLEMENTED YET !!!
                 * ===========================================
                 * This mutation is made for future purposes,
                 * in particoular the possibility to save a post
                 * maybe to rewatch it later. 
                 */

                return resultOk('Post successfully saved.');
            } catch (error) {
                return internalErr();
            }
        }),
    getSaved: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                /**
                 * !!! WARNING - NOT IMPLEMENTED YET !!!
                 * ===========================================
                 * This query returns all the posts saved by the 
                 * user in the context (@me)
                 */
                return resultOk('...post');
            } catch (error) {
                return internalErr();
            }
        }),
    getCommentById: protectedProcedure
        .input(commentIdSchema)
        .query(async ({ input, ctx }) => {
            try {
                const comment = await postService.getCommentById(input);

                if (!comment)
                    return resultErr('Comment not found.');

                return comment;
            } catch (error) {
                return internalErr();
            }
        }),
    createComment: protectedProcedure
        .input(commentRequestSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const comment = await postService.createNewComment(ctx.user.userId, { text: input.text }, input.postId);

                if (!comment)
                    return resultErr('Failed to create comment.');

                return resultOk(`Comment created successfully.`);
            } catch (error) {
                return internalErr();
            }
        }),
    editComment: protectedProcedure
        .input(commentEditSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const comment = await postService.getCommentById(input.commentId);

                if (comment?.userId !== ctx.user.userId)
                    return resultErr('You cannot edit a someone else comment.');

                return resultOk('Comment successfully edited');
            } catch (error) {
                return internalErr();
            }
        }),
    deleteComment: protectedProcedure
        .input(commentIdSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const comment = await postService.deleteComment(input);

                if (!comment)
                    return resultErr('Comment not found.');

                const userCaller = userRouter.createCaller(ctx);
                const userPosts = await userCaller.getAll();

                if (comment.userId !== ctx.user.userId || !userPosts.some(p => p.id === comment.postId))
                    return resultErr('You can delete only your comments, or comments under your posts.');

                return resultOk('Comment successfully deleted');
            } catch (error) {
                return internalErr();
            }
        })
})