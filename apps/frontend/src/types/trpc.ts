import type { trpc } from '@/trpc'

type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never

export type User = NonNullable<Awaited<ReturnType<typeof trpc.user.getMe.query>>>

// I'll assume `trpc.post.getById.query` exists and returns a full Post object.
export type Post = NonNullable<Awaited<ReturnType<typeof trpc.post.getById.query>>>

export type Like = ArrayElement<Post['likes']> // post.likes
export type UserLike = ArrayElement<User['likes']> // user.likes

export type UserComment = ArrayElement<User['comments']> // user.comments
export type PostComment = ArrayElement<Post['comments']> // post.comments

// This is a category associated with a post, likely partial.
export type PostCategory = ArrayElement<Post['categories']>

// I'll assume `trpc.category.getById.query` exists for the full category type.
export type Category = NonNullable<Awaited<ReturnType<typeof trpc.category.getById.query>>>

type Friendships = Awaited<ReturnType<typeof trpc.friend.getAll.query>>
export type Friendship = ArrayElement<Friendships>

type FriendRequests = Awaited<ReturnType<typeof trpc.friend.getReceivedRequests.query>>
export type FriendRequest = ArrayElement<FriendRequests>

export type Avatar = NonNullable<User['profile']>['avatar']
export type Banner = NonNullable<User['profile']>['banner']

export type Role = User['role']
