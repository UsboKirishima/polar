import * as userService from "../../services/users.service";
import * as postService from "../../services/posts.service";
import * as bannerService from "../../services/banner.service";
import * as avatarService from "../../services/avatar.service";
import { protectedProcedure, t } from "../trpc";
import { postIdSchema, postSchema, updatePostSchema } from "../../types/zod";
import { resultErr, resultOk } from "../../utils/response";

async function isUserThePostAuthor(userId: string, postId: string): Promise<boolean> {
    const userPosts = await postService.getPostsByUserId(userId);
    return userPosts.some(post => post.id === postId);
}


export const postRouter = t.router({
    getById: protectedProcedure
        .input(postIdSchema)
        .query(async ({ input, ctx }) => {
            const post = await postService.getPostByid(input);

            if (!post)
                return resultErr('Failed to find post: ' + input);

            return post;
        }),
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            return await postService.getAllPosts();
        }),
    getFeed: protectedProcedure
        .query(async ({ ctx }) => {
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
        }),
    create: protectedProcedure
        .input(postSchema)
        .mutation(async ({ input, ctx }) => {
            const newPost = await postService.createNewPost(ctx.user.userId, {
                text: input.text,
                categories: input.categories
            }, input.categories);

            return newPost;
        }),
    edit: protectedProcedure
        .input(updatePostSchema)
        .mutation(async ({ input, ctx }) => {

            if (!(await isUserThePostAuthor(ctx.user.userId, input.postId))) {
                return resultErr(`You can't update someone else post: ${input.postId}`);
            }

            const updatedPost = await postService.updatePost(input.postId, input.post);

            if (!updatedPost)
                return resultErr(`Failed to update post ${input.postId}`);

            return updatedPost;
        }),
    delete: protectedProcedure
        .input(postIdSchema)
        .mutation(async ({ input, ctx }) => {

            if (!(await isUserThePostAuthor(ctx.user.userId, input))) {
                return resultErr(`You can't delete someone else post: ${input}`);
            }

            await postService.deletePost(input);
            return resultOk(`Post with id (${input}) was successfully deleted.`);
        })
})