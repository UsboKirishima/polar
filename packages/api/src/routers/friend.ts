import { protectedProcedure, t } from "../trpc";
import { TRPCError } from "@trpc/server";
import { friendService } from "@polar/services";
import { userIdSchema } from "@polar/types/zod";
import { z } from "zod";

export const friendRouter = t.router({
    /**
     * Get all received friend requests (others → me)
     */
    getReceivedRequests: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                return await friendService.getAllPendingFriendRequests(ctx.user.userId);
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch received friend requests",
                });
            }
        }),

    /**
     * Get all sent friend requests (me → others)
     */
    getSentRequests: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                return await friendService.getAllSentRequests(ctx.user.userId);
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch sent friend requests",
                });
            }
        }),

    /**
     * Get all friends of the current user
     */
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                return await friendService.getAllFriendsByUserId(ctx.user.userId);
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch friends",
                });
            }
        }),

    /**
     * Send a new friend request
     */
    sendRequest: protectedProcedure
        .input(userIdSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const friendRequest = await friendService.createFriendRequest(ctx.user.userId, input);

                if (!friendRequest.id) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Failed to create friend request",
                    });
                }

                return friendRequest;
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Error while sending friend request",
                });
            }
        }),

    /**
     * Accept a friend request
     */
    acceptRequest: protectedProcedure
        .input(z.string().uuid("Invalid sender UUID"))
        .mutation(async ({ input, ctx }) => {
            try {
                await friendService.acceptFriendRequest(input, ctx.user.userId);
                return { ok: true, message: "Accepted friend request" };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to accept friend request",
                });
            }
        }),

    /**
     * Deny a friend request
     */
    denyRequest: protectedProcedure
        .input(z.string().uuid("Invalid sender UUID"))
        .mutation(async ({ input, ctx }) => {
            try {
                await friendService.denyFriendRequest(input, ctx.user.userId);
                return { ok: true, message: "Friend request ignored" };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to deny friend request",
                });
            }
        }),

    /**
     * Remove a friend
     */
    remove: protectedProcedure
        .input(userIdSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                await friendService.removeFriendship(ctx.user.userId, input);
                return { ok: true, message: "Friend successfully removed" };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to remove friend",
                });
            }
        }),
});
