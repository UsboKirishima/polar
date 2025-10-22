import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config'
import { User } from '@polar/db';

// Usually I keep the token between 5 minutes - 15 minutes
export function generateAccessToken(user: User) {
  return jwt.sign({ userId: user.id }, (process.env.JWT_ACCESS_SECRET as string), {
    expiresIn: '24h',
  });
}

// Generate a random string as refreshToken
export function generateRefreshToken() {
  const token = crypto.randomBytes(16).toString('base64url');
  return token;
}

export function generateTokens(user: User) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  return { accessToken, refreshToken };
}
