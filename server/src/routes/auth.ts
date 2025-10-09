import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  registerPINValidation,
  registerCSRRepValidation,
  loginValidation,
  updatePasswordValidation,
} from '../validators/auth.validator';

const router = Router();

// Public routes
router.post('/register/pin', validate(registerPINValidation), AuthController.registerPIN);
router.post('/register/csr-rep', validate(registerCSRRepValidation), AuthController.registerCSRRep);
router.post('/login', validate(loginValidation), AuthController.login);

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/password', authenticate, validate(updatePasswordValidation), AuthController.updatePassword);

export default router;
