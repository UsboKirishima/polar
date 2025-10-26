import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '@polar/types/general';

declare module 'express' {
  interface Request {
    payload?: JwtPayload;
  }
}