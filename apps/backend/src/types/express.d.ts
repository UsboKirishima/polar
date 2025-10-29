/* eslint-disable ts/consistent-type-definitions */
import type { JwtPayload } from '@polar/types/general';

declare global {
    namespace Express {
        interface Request {
            payload?: JwtPayload;
        }
    }
}
