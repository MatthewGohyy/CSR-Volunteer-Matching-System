import { Router } from 'express';
import { CreateUserAccountController } from '../controllers/userAdmin/createUserAccount.controller';
import { ViewUserAccountsController } from '../controllers/userAdmin/viewUserAccounts.controller';
import { UpdateUserAccountController } from '../controllers/userAdmin/updateUserAccount.controller';
import { SuspendUserAccountController } from '../controllers/userAdmin/suspendUserAccount.controller';
import { SearchUserAccountsController } from '../controllers/userAdmin/searchUserAccounts.controller';
import { CreateUserProfileController } from '../controllers/userAdmin/createUserProfile.controller';
import { ViewUserProfilesController } from '../controllers/userAdmin/viewUserProfiles.controller';
import { UpdateUserProfileController } from '../controllers/userAdmin/updateUserProfile.controller';
import { SuspendUserProfileController } from '../controllers/userAdmin/suspendUserProfile.controller';
import { SearchUserProfilesController } from '../controllers/userAdmin/searchUserProfiles.controller';
import { DeleteUserAccountController } from '../controllers/userAdmin/deleteUserAccount.controller';
import { GetSystemStatsController } from '../controllers/userAdmin/getSystemStats.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserType } from '@prisma/client';

const router = Router();

// All routes require admin authentication
router.use(authenticate, authorize(UserType.ADMIN));

// User Account Management Routes (Stories #3-#7)
// Story #7: Search user accounts (must be before :id route)
router.get('/users/search', SearchUserAccountsController.handle);

// Story #4: View user accounts
router.get('/users', ViewUserAccountsController.handle);
router.get('/users/:id', ViewUserAccountsController.handle);

// Story #3: Create user accounts
router.post('/users', CreateUserAccountController.handle);

// Story #5: Update user account
router.put('/users/:id', UpdateUserAccountController.handle);

// Update user status (suspend/activate) - used by frontend
router.put('/users/:id/status', UpdateUserAccountController.handle);

// Story #6: Suspend user account
router.put('/users/:id/suspend', SuspendUserAccountController.handle);

// Delete user account (utility)
router.delete('/users/:id', DeleteUserAccountController.handle);

// Profile Management Routes (Stories #8-#12)
// Story #12: Search user profiles (must be before :id route)
router.get('/profiles/search', SearchUserProfilesController.handle);

// Story #9: View user profiles
router.get('/profiles', ViewUserProfilesController.handle);
router.get('/profiles/:id', ViewUserProfilesController.handle);

// Story #8: Create user profiles
router.post('/profiles', CreateUserProfileController.handle);

// Story #10: Update user profile
router.put('/profiles/:id', UpdateUserProfileController.handle);

// Story #11: Suspend user profile
router.put('/profiles/:id/suspend', SuspendUserProfileController.handle);

// System statistics (utility - not a user story)
router.get('/stats', GetSystemStatsController.handle);

export default router;
