/**
 * This abstraction-layer is made for the migration from REST API
 * to tRPC Type-safe API.
 * The front-end code is a little bit large as a codebase, so the best
 * pratctice is to make a gradual migration.
 *
 * This layer is realized between the old Pinia stores that were used to
 * fetch the Polar REST API by using Axios and the new TenStack + tRPC
 * configuration.
 *
 * So why we need to use this layer? because of leaving the compatibility
 * to call API (with tRPC) by accessing from Pinia routes. (not the best).
 *
 * +------------+         +-----------+       +-------------+       +----------+
 * |  Component |---------|   Pinia   |-------|  Interface  |------>|  Server  |
 * +------------+         +-----------+       +-------------+       +----------+
 */

export * as auth from './auth-interface'
export * as user from './user-interface'
export * as friend from './friend-interface'
export * as post from './post-interface'
export * as category from './category-interface'
