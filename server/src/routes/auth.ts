import { Router } from 'express';
import { LoginController } from '../controllers/auth/login.controller';
import { LogoutController } from '../controllers/auth/logout.controller';
import { RegisterPINController } from '../controllers/auth/registerPIN.controller';
import { RegisterCSRRepController } from '../controllers/auth/registerCSRRep.controller';
import { GetProfileController } from '../controllers/auth/getProfile.controller';
import { UpdatePasswordController } from '../controllers/auth/updatePassword.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  registerPINValidation,
  registerCSRRepValidation,
  loginValidation,
  updatePasswordValidation,
} from '../validators/auth.validator';

const router = Router();

// Public routes - Registration
router.post('/register/pin', validate(registerPINValidation), RegisterPINController.handle);
router.post('/register/csr-rep', validate(registerCSRRepValidation), RegisterCSRRepController.handle);

// Story #1, #13, #24, #33: Login (all user types)
router.post('/login', validate(loginValidation), LoginController.handle);

// Story #2, #14, #25, #34: Logout (all user types)
router.post('/logout', authenticate, LogoutController.handle);

// Protected routes - Profile & Password
router.get('/profile', authenticate, GetProfileController.handle);
router.put('/password', authenticate, validate(updatePasswordValidation), UpdatePasswordController.handle);

export default router;
