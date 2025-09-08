import { Router, Response, NextFunction } from 'express';
import { isAuthenticated, AuthenticatedRequest } from '../middlewares';
import { findProfileById, findUserAndProfileById, findUserById } from '../services/users.service';
import { Profile, User } from '../generated/prisma';
import * as UsersController from '../controllers/users.controller';
import { SimpleUserSchema } from '../types/general';

const router = Router();


router.get('/profile', isAuthenticated, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.payload!;
        const user = await findUserAndProfileById(userId);

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


// Gets
router.get('/', isAuthenticated, UsersController.getAllUsers) // Returns all the users id, avatars and usernames
router.get('/:id', isAuthenticated, UsersController.getUserById);
router.get('/:username', isAuthenticated, UsersController.getUserByUsername)

// Profile settings
router.patch('/:id/username', isAuthenticated, UsersController.modifyUsername);

export default router;