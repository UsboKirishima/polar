import { protectedProcedure, t } from "../trpc";

import * as friendService from '../../services/friends.service';
import { internalErr, resultErr, resultOk } from "../../utils/response";
import { userIdSchema } from "../../types/zod";
import { z } from "zod/v4";

export const friendRouter = t.router({
    /**
     * Get all the received friends request.
     * Others to me.
     */
    getReceivedRequests: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const requests = await friendService.getAllPendingFriendRequests(ctx.user.userId);

                return requests;
            } catch (error) {
                return internalErr();
            }
        }),
    /**
     * Get all set requests, provides all the pending
     * requests sent by the context user.
     */
    getSentRequests: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const requests = await friendService.getAllSentRequests(ctx.user.userId);

                return requests;
            } catch (error) {
                return internalErr();
            }
        }),
    /**
     * Get all friends of the context user
     */
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const friends = await friendService.getAllFriendsByUserId(ctx.user.userId);

                return friends;
            } catch (error) {
                return internalErr();
            }
        }),
    sendRequest: protectedProcedure
        .input(userIdSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const friendRequest = await friendService.createFriendRequest(ctx.user.userId, input);

                if (!friendRequest.id)
                    return resultErr('Failed to create friend request.');

                return friendRequest;
            } catch (error) {
                return internalErr();
            }
        }),
    acceptRequest: protectedProcedure
        .input(z.uuid({ error: 'Invalid sender UUID' }))
        .mutation(async ({ input, ctx }) => {
            try {
                await friendService.acceptFriendRequest(input, ctx.user.userId);
                return resultOk('Accepted friend request.');
            } catch (error) {
                return internalErr();
            }
        }),
    denyRequest: protectedProcedure
        .input(z.uuid({ error: 'Invalid sender UUID' }))
        .mutation(async ({ input, ctx }) => {
            try {
                await friendService.denyFriendRequest(input, ctx.user.userId);
                return resultOk('Friend request ignored.');
            } catch (error) {
                return internalErr();
            }
        }),
    remove: protectedProcedure
        .input(userIdSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                await friendService.removeFriendship(ctx.user.userId, input);
                return resultOk('Friend successfully removed.');
            } catch (error) {
                return internalErr();
            }
        })
})