import { userSchema } from "@polar/types";
import { publicProcedure, t } from "../trpc";
import { userService } from "@polar/services";
import { resultErr } from "@polar/utils";

export const authRouter = t.router({
    register: publicProcedure
        .input(userSchema)
        .mutation(async ({ input, ctx }) => {

        })
})