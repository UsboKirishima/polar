import { queryClient } from '@/query-client'
import { trpc } from '@/trpc'

export const fetchPendingRequests = async () => {
    return await queryClient.fetchQuery({
        queryKey: [],
        queryFn: () => trpc.friend.getReceivedRequests.query(),
    })
}

export const fetchFriends = async () => {
    return await queryClient.fetchQuery({
        queryKey: [],
        queryFn: () => trpc.friend.getAll.query(),
    })
}

export const sendRequest = async (receiverId: string) => {
    return await trpc.friend.sendRequest.mutate(receiverId)
}

export const sendRequestByUsername = async (username: string) => {
    const user = await trpc.user.getByUsername.query(username)
    return await sendRequest(user.id)
}

export const acceptRequest = async (senderId: string) => {
    return await trpc.friend.acceptRequest.mutate(senderId)
}

export const denyRequest = async (senderId: string) => {
    return await trpc.friend.denyRequest.mutate(senderId)
}

export const removeFriend = async (friendId: string) => {
    return await trpc.friend.remove.mutate(friendId)
}
