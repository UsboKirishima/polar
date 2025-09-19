import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../middlewares';

declare module 'express' {
  interface Request {
    payload?: JwtPayload;
  }
}