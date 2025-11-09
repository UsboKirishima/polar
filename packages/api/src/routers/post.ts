import { postService } from "@polar/services";
import { protectedProcedure, t } from "../trpc";
import {
    commentEditSchema,
    commentIdSchema,
    commentRequestSchema,
    postIdSchema,
    postSchema,
    updatePostSchema
} from "@polar/types/zod";
import { TRPCError } from "@trpc/server";
import { userRouter } from "./user";

async function isUserThePostAuthor(userId: string, postId: string): Promise<boolean> {
    const userPosts = await postService.getPostsByUserId(userId);
    return userPosts.some(post => post.id === postId);
}

export const postRouter = t.router({
    getById: protectedProcedure
        .input(postIdSchema)
        .query(async ({ input }) => {
            try {
                const post = await postService.getPostByid(input);
                if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Post not found." });
                return post;
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch post.",
                    cause: error
                });
            }
        }),

    getAll: protectedProcedure
        .query(async () => {
            try {
                return await postService.getAllPosts();
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch posts.",
                    cause: error
                });
            }
        }),

    getFeed: protectedProcedure
        .query(async () => {
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
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch feed.",
                    cause: error
                });
            }
        }),

    create: protectedProcedure
        .input(postSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                console.log(input);
                const newPost = await postService.createNewPost(ctx.user.userId, {
                    text: input.text,
                    categories: input.categories,
                    color: input.color
                });

                return newPost;
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create post.",
                    cause: error
                });
            }
        }),

    edit: protectedProcedure
        .input(updatePostSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                if (!(await isUserThePostAuthor(ctx.user.userId, input.postId)))
                    throw new TRPCError({ code: "FORBIDDEN", message: "You can't edit someone else's post." });

                const updatedPost = await postService.updatePost(input.postId, input.post);
                if (!updatedPost)
                    throw new TRPCError({ code: "BAD_REQUEST", message: "Failed to update post." });

                return updatedPost;
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to edit post.",
                    cause: error
                });
            }
        }),

    delete: protectedProcedure
        .input(postIdSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                if (!(await isUserThePostAuthor(ctx.user.userId, input)))
                    throw new TRPCError({ code: "FORBIDDEN", message: "You can't delete someone else's post." });

                await postService.deletePost(input);
                return { message: `Post with id (${input}) was successfully deleted.` };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to delete post.",
                    cause: error
                });
            }
        }),

    toggleLike: protectedProcedure
        .input(postIdSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                await postService.likePost(input, ctx.user.userId);
                return { message: "Post liked/unliked successfully." };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to toggle like.",
                    cause: error
                });
            }
        }),

    toggleSave: protectedProcedure
        .input(postIdSchema)
        .mutation(async () => {
            /**
             * !!! WARNING - NOT IMPLEMENTED YET !!!
             * ===========================================
             * This mutation is made for future purposes,
             * in particoular the possibility to save a post
             * maybe to rewatch it later. 
             */
            try {
                return { message: "Post successfully saved (feature not yet implemented)." };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to toggle save.",
                    cause: error
                });
            }
        }),

    getSaved: protectedProcedure
        .query(async () => {
            try {
                /**
                 * !!! WARNING - NOT IMPLEMENTED YET !!!
                 * ===========================================
                 * This query returns all the posts saved by the 
                 * user in the context (@me)
                 */
                return { message: "...post" };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch saved posts.",
                    cause: error
                });
            }
        }),

    getCommentById: protectedProcedure
        .input(commentIdSchema)
        .query(async ({ input }) => {
            try {
                const comment = await postService.getCommentById(input);
                if (!comment)
                    throw new TRPCError({ code: "NOT_FOUND", message: "Comment not found." });

                return comment;
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch comment.",
                    cause: error
                });
            }
        }),

    createComment: protectedProcedure
        .input(commentRequestSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const comment = await postService.createNewComment(ctx.user.userId, { text: input.text }, input.postId);
                if (!comment)
                    throw new TRPCError({ code: "BAD_REQUEST", message: "Failed to create comment." });

                return { message: "Comment created successfully." };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create comment.",
                    cause: error
                });
            }
        }),

    editComment: protectedProcedure
        .input(commentEditSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const comment = await postService.getCommentById(input.commentId);
                if (comment?.userId !== ctx.user.userId)
                    throw new TRPCError({ code: "FORBIDDEN", message: "You cannot edit someone else's comment." });

                return { message: "Comment successfully edited." };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to edit comment.",
                    cause: error
                });
            }
        }),

    deleteComment: protectedProcedure
        .input(commentIdSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const comment = await postService.deleteComment(input);
                if (!comment)
                    throw new TRPCError({ code: "NOT_FOUND", message: "Comment not found." });

                const userCaller = userRouter.createCaller(ctx);
                const userPosts = await userCaller.getAll();

                if (comment.userId !== ctx.user.userId || !userPosts.some(p => p.id === comment.postId))
                    throw new TRPCError({ code: "FORBIDDEN", message: "You can only delete your comments or comments under your posts." });

                return { message: "Comment successfully deleted." };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to delete comment.",
                    cause: error
                });
            }
        })
});
