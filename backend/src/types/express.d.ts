import * as jwt from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    payload?: string | jwt.JwtPayload;
  }
}