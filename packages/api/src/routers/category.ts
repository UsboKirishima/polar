import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, t } from "../trpc";

import { postService } from "@polar/services";
import { z } from "zod/v4";
import { categoryIdSchema, categoryNameSchema } from "@polar/types/zod";

export const categoryRouter = t.router({
    /**
     * Get all categories (public)
     */
    getAll: publicProcedure.query(async () => {
        try {
            const cats = await postService.getAllCategories();
            return cats;
        } catch (error: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error?.message ?? "Failed to fetch categories",
            });
        }
    }),

    /**
     * Search categories by name or keyword
     */
    search: protectedProcedure
        .input(z.string())
        .query(async ({ input }) => {
            try {
                const results = await postService.searchCategory(input);
                return results;
            } catch (error: any) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error?.message ?? "Failed to search categories",
                });
            }
        }),

    /**
     * Get category by ID
     */
    getById: protectedProcedure
        .input(categoryIdSchema)
        .query(async ({ input }) => {
            try {
                const cat = await postService.getCategoryById(input);
                if (!cat) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Category not found",
                    });
                }
                return cat;
            } catch (error: any) {
                if (error instanceof TRPCError) throw error;
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error?.message ?? "Failed to fetch category by ID",
                });
            }
        }),

    /**
     * Get category by name
     */
    getByName: protectedProcedure
        .input(categoryNameSchema)
        .query(async ({ input }) => {
            try {
                const cat = await postService.getCategoryByName(input);
                if (!cat) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Category not found",
                    });
                }
                return cat;
            } catch (error: any) {
                if (error instanceof TRPCError) throw error;
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error?.message ?? "Failed to fetch category by name",
                });
            }
        }),
});
