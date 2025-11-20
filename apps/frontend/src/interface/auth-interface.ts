import { trpc } from "@/trpc";
import { queryClient } from "@/query-client";

type LoginOpts = {
    email: string;
    password: string;
}

export const login = async (opts: LoginOpts) => {
    return await trpc.auth.login.mutate(opts)
}

type RegisterOpts = {
    email: string,
    password: string,
    username: string,
    dateOfBirth: Date,
    fullName: string,
}

export const register = async (opts: RegisterOpts) => {
    return await trpc.auth.register.mutate({
        email: opts.email,
        password: opts.password,
        profile: {
            username: opts.username,
            dateOfBirth: opts.dateOfBirth,
            fullName: opts.fullName
        }
    })

}

export const checkAuth = async () => {
    return await queryClient.fetchQuery(
        {
            queryKey: [],
            queryFn: () => trpc.user.getMe.query()
        }
    )
}