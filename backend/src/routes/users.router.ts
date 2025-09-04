import { Router, Response, NextFunction } from 'express';
import { isAuthenticated, AuthenticatedRequest } from '../middlewares';
import { findProfileById, findUserById } from '../services/users.service';
import { Profile, User } from '../generated/prisma';
import * as UsersController from '../controllers/users.controller';

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

        /**
         * Append to the result the profile information
         * if it exists.
         */
        if (user.profileId) {
            const profile: Profile | null = await findProfileById(user.profileId);

            if(!profile) {
                res.status(404).json({ message: 'Profile associated to user not found' });
                return;
            }

            res.json({ ...safeUser, profile });
            return;
        }

        res.json(safeUser);
    } catch (err) {
        next(err);
    }
});


router.get('/:id', isAuthenticated, UsersController.getUserById);

// Profile settings
router.patch('/:id/username', isAuthenticated, UsersController.modifyUsername);

export default router;