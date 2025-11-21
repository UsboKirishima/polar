import { queryClient } from '@/query-client'
import { trpc } from '@/trpc'

export const getAll = async () => {
    return await queryClient.fetchQuery({
        queryKey: ['posts', 'all'],
        queryFn: () => trpc.post.getAll.query(),
    })
}

export const getById = async (id: string) => {
    return await queryClient.fetchQuery({
        queryKey: ['posts', id],
        queryFn: () => trpc.post.getById.query(id),
    })
}

export const getByUser = async (userId: string) => {
    return await queryClient.fetchQuery({
        queryKey: ['posts', 'user', userId],
        queryFn: () => trpc.user.getPosts.query(userId),
    })
}

export const create = async (opts: Parameters<typeof trpc.post.create.mutate>[0]) => {
    return await trpc.post.create.mutate(opts)
}

export const deleteById = async (id: string) => {
    return await trpc.post.delete.mutate(id)
}

export const toggleLike = async (id: string) => {
    return await trpc.post.toggleLike.mutate(id)
}

export const addComment = async (opts: Parameters<typeof trpc.post.createComment.mutate>[0]) => {
    return await trpc.post.createComment.mutate(opts)
}

export const removeComment = async (id: string) => {
    return await trpc.post.deleteComment.mutate(id)
}
