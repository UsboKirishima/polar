import { internalErr } from '@polar/utils'
import { protectedProcedure, publicProcedure, t } from '../trpc'

import { postService } from '@polar/services'
import { z } from 'zod/v4'
import { categoryIdSchema, categoryNameSchema } from '@polar/types'

export const categoryRouter = t.router({
    getAll: publicProcedure.query(async ({ ctx }) => {
        try {
            const cats = await postService.getAllCategories()

            return cats
        } catch (error) {
            return internalErr()
        }
    }),
    /* Get the most significant results */
    search: protectedProcedure
        .input(z.string())
        .query(async ({ input, ctx }) => {
            try {
                const results = await postService.searchCategory(input)

                return results
            } catch (error) {
                return internalErr()
            }
        }),
    getById: protectedProcedure
        .input(categoryIdSchema)
        .query(async ({ input, ctx }) => {
            try {
                const cat = await postService.getCategoryById(input)

                return cat
            } catch (error) {
                return internalErr()
            }
        }),
    getByName: protectedProcedure
        .input(categoryNameSchema)
        .query(async ({ input, ctx }) => {
            try {
                const cat = await postService.getCategoryByName(input)

                return cat
            } catch (error) {
                return internalErr()
            }
        }),
})
