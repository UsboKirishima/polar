// Auth service exports
export * from './auth'

// Avatar service exports
export * from './avatar'

// Banner service exports
export * from './banner'

// Friend service exports
export * from './friend'

// Post service exports
export * from './post'

// User service exports
export * from './user'

// Import all modules to create namespace objects
import * as authModule from './auth'
import * as avatarModule from './avatar'
import * as bannerModule from './banner'
import * as friendModule from './friend'
import * as postModule from './post'
import * as userModule from './user'

// Export namespace objects for compatibility
export const authService = authModule
export const avatarService = avatarModule
export const bannerService = bannerModule
export const friendService = friendModule
export const postService = postModule
export const userService = userModule

// Default export for backward compatibility
export default {
    authService: authModule,
    avatarService: avatarModule,
    bannerService: bannerModule,
    friendService: friendModule,
    postService: postModule,
    userService: userModule,
}
