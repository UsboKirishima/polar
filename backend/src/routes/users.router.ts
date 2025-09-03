import { Router, Response, NextFunction } from 'express';
import { isAuthenticated, AuthenticatedRequest } from '../middlewares';
import { findUserById } from '../services/users.service';
import { User } from '../generated/prisma';

const router = Router();


router.get('/profile', isAuthenticated, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.payload!;
        const user: User | null = await findUserById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { password, ...safeUser } = user;
        res.json(safeUser);
    } catch (err) {
        next(err);
    }
});


export default router;
