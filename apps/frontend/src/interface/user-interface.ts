import { queryClient } from '@/query-client'
import { trpc } from '@/trpc'

type UserByIdInput = Parameters<typeof trpc.user.getById.query>[0]
type AllFriendsByUserId = Parameters<typeof trpc.user.getFriends.query>[0]

export const fetchUsers = async () => {
    return await queryClient.fetchQuery({
        queryKey: [],
        queryFn: () => trpc.user.getAll.query(),
    })
}

export const getUserById = async (input: UserByIdInput) => {
    return await queryClient.fetchQuery({
        queryKey: [],
        queryFn: () => trpc.user.getById.query(input),
    })
}

export const getAllFriendsByUserId = async (input: AllFriendsByUserId) => {
    return await queryClient.fetchQuery({
        queryKey: [],
        queryFn: () => trpc.user.getFriends.query(input),
    })
}
