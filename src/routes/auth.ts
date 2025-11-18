import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { validate } from '@/middleware/validation';
import { authenticate } from '@/middleware/auth';
import { authSchemas } from '@/validation/schemas';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(authSchemas.register), authController.register);
router.post('/login', validate(authSchemas.login), authController.login);
router.get('/me', authenticate, authController.getProfile);

export default router;