import { trpc } from '@/trpc'
import { queryClient } from '@/query-client'

type LoginInput = Parameters<typeof trpc.auth.login.mutate>[0]
type RegisterInput = Parameters<typeof trpc.auth.register.mutate>[0]

export const login = async (opts: LoginInput) => {
    return await trpc.auth.login.mutate(opts)
}

export const register = async (opts: RegisterInput) => {
    return await trpc.auth.register.mutate(opts)
}

export const checkAuth = async () => {
    return await queryClient.fetchQuery({
        queryKey: [],
        queryFn: () => trpc.user.getMe.query(),
    })
}
