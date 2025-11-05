import { db } from '@polar/db';
import { hashToken } from '@polar/utils';

// used when we create a refresh token.
// a refresh token is valid for 30 days
// that means that if a user is inactive for more than 30 days, he will be required to log in again
export async function addRefreshTokenToWhitelist({ refreshToken, userId }: { refreshToken: string; userId: string; }) {
    return await db.refreshToken.create({
        data: {
            hashedToken: hashToken(refreshToken),
            userId,
            expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
        },
    });
}

// used to check if the token sent by the client is in the database.
export async function findRefreshToken(token: string) {
    return await db.refreshToken.findUnique({
        where: {
            hashedToken: hashToken(token),
        },
    });
}

// soft delete tokens after usage.
export async function deleteRefreshTokenById(id: string) {
    return await db.refreshToken.update({
        where: {
            id,
        },
        data: {
            revoked: true,
        },
    });
}

export async function revokeTokens(userId: string) {
    return await db.refreshToken.updateMany({
        where: {
            userId,
        },
        data: {
            revoked: true,
        },
    });
}
