import { queryClient } from '@/query-client'
import { trpc } from '@/trpc'

export const getAll = async () => {
    return await queryClient.fetchQuery({
        queryKey: ['categories', 'all'],
        queryFn: () => trpc.category.getAll.query(),
    })
}

export const getById = async (id: number) => {
    return await queryClient.fetchQuery({
        queryKey: ['categories', id],
        queryFn: () => trpc.category.getById.query(id),
    })
}

export const getByName = async (name: string) => {
    return await queryClient.fetchQuery({
        queryKey: ['categories', 'name', name],
        queryFn: () => trpc.category.getByName.query(name),
    })
}
