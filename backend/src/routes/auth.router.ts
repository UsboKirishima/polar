import express from 'express';
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/jwt';
import {
    addRefreshTokenToWhitelist,
    findRefreshToken,
    deleteRefreshTokenById,
    revokeTokens,
} from '../services/auth.service';
import {
    findUserByEmail,
    findUserById,
    createUserWithProfile,
} from '../services/users.service';
import { TUserSchema } from '../types/zod';

const router = express.Router();

// -------------------- REGISTER --------------------
router.post('/register', async (req, res, next) => {
    try {
        const userRequest: TUserSchema = req.body;

        if (!userRequest.email || !userRequest.password) {
            res.status(400);
            throw new Error('You must provide an email and a password.');
        }

        // Check if use already exists
        const existingUser = await findUserByEmail(userRequest.email);
        if (existingUser) {
            res.status(400);
            throw new Error('Email already in use.');
        }

        // User creation with nested profile
        const user = await createUserWithProfile({
            email: userRequest.email,
            password: userRequest.password,
            profile: {
                username: userRequest.profile.username,
                dateOfBirth: userRequest.profile.dateOfBirth,
                fullName: userRequest.profile.fullName
            },
        });

        // Token generation
        const { accessToken, refreshToken } = generateTokens(user);
        await addRefreshTokenToWhitelist({ refreshToken, userId: user.id });

        res.json({ accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
});

// -------------------- LOGIN --------------------
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error('You must provide an email and a password.');
        }

        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
            res.status(403);
            throw new Error('Invalid login credentials.');
        }

        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            res.status(403);
            throw new Error('Invalid login credentials.');
        }

        const { accessToken, refreshToken } = generateTokens(existingUser);
        await addRefreshTokenToWhitelist({ refreshToken, userId: existingUser.id });

        res.json({ accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
});

// -------------------- REFRESH TOKEN --------------------
router.post('/refreshToken', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            throw new Error('Missing refresh token.');
        }

        const savedRefreshToken = await findRefreshToken(refreshToken);
        if (
            !savedRefreshToken ||
            savedRefreshToken.revoked === true ||
            Date.now() >= savedRefreshToken.expireAt.getTime()
        ) {
            res.status(401);
            throw new Error('Unauthorized');
        }

        const user = await findUserById(savedRefreshToken.userId);
        if (!user) {
            res.status(401);
            throw new Error('Unauthorized');
        }

        await deleteRefreshTokenById(savedRefreshToken.id);
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
        await addRefreshTokenToWhitelist({ refreshToken: newRefreshToken, userId: user.id });

        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
        next(err);
    }
});

// -------------------- REVOKE TOKENS --------------------
router.post('/revokeRefreshTokens', async (req, res, next) => {
    try {
        const { userId } = req.body;
        await revokeTokens(userId);
        res.json({ message: `Tokens revoked for user with id #${userId}` });
    } catch (err) {
        next(err);
    }
});

export default router;
