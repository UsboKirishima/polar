import type { TProfileSchema, TUserSchema } from './zod'

export type SimpleUserSchema = TUserSchema
export type SimpleProfileSchema = TProfileSchema

export type MediaType = 'avatars' | 'banners'

export type ServiceType =
  | 'auth'
  | 'avatar'
  | 'banner'
  | 'friends'
  | 'posts'
  | 'users'

export type JwtPayload = {
  userId: string
  iat: number
  exp: number
}
