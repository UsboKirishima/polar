import { db } from '@polar/db'
import { hashToken } from '@polar/utils'

// used when we create a refresh token.
// a refresh token is valid for 30 days
// that means that if a user is inactive for more than 30 days, he will be required to log in again
export function addRefreshTokenToWhitelist({
    refreshToken,
    userId,
}: {
    refreshToken: string
    userId: string
}) {
    return db.refreshToken.create({
        data: {
            hashedToken: hashToken(refreshToken),
            userId,
            expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
        },
    })
}

// used to check if the token sent by the client is in the database.
export function findRefreshToken(token: string) {
    return db.refreshToken.findUnique({
        where: {
            hashedToken: hashToken(token),
        },
    })
}

// soft delete tokens after usage.
export function deleteRefreshTokenById(id: string) {
    return db.refreshToken.update({
        where: {
            id,
        },
        data: {
            revoked: true,
        },
    })
}

export function revokeTokens(userId: string) {
    return db.refreshToken.updateMany({
        where: {
            userId,
        },
        data: {
            revoked: true,
        },
    })
}
