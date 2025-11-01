import { Router } from 'express';
import { CreateUserAccountController } from '../controllers/userAdmin/createUserAccount.controller';
import { ViewUserAccountController } from '../controllers/userAdmin/viewUserAccount.controller';
import { UpdateUserAccountController } from '../controllers/userAdmin/updateUserAccount.controller';
import { SuspendUserAccountController } from '../controllers/userAdmin/suspendUserAccount.controller';
import { ActivateUserAccountController } from '../controllers/userAdmin/activateUserAccount.controller';
import { SearchUserAccountsController } from '../controllers/userAdmin/searchUserAccounts.controller';
import { CreateUserProfileController } from '../controllers/userAdmin/createUserProfile.controller';
import { ViewUserProfileController } from '../controllers/userAdmin/viewUserProfile.controller';
import { UpdateUserProfileController } from '../controllers/userAdmin/updateUserProfile.controller';
import { SuspendUserProfileController } from '../controllers/userAdmin/suspendUserProfile.controller';
import { ActivateUserProfileController } from '../controllers/userAdmin/activateUserProfile.controller';
import { SearchUserProfilesController } from '../controllers/userAdmin/searchUserProfiles.controller';
import { DeleteUserAccountController } from '../controllers/userAdmin/deleteUserAccount.controller';
import { GetSystemStatsController } from '../controllers/userAdmin/getSystemStats.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticate, authorize('User Administrator'));

// User Account Management Routes (Stories #3-#7)
// Story #4 & #7: View/Search user accounts (list all or filtered)
router.get('/users', SearchUserAccountsController.handle);
router.get('/users/search', SearchUserAccountsController.handle);

// Story #4: View single user account by ID
router.get('/users/:id', ViewUserAccountController.handle);

// Story #3: Create user accounts
router.post('/users', CreateUserAccountController.handle);

// Story #5: Update user account
router.put('/users/:id', UpdateUserAccountController.handle);

// Update user status (suspend/activate) - used by frontend
router.put('/users/:id/status', UpdateUserAccountController.handle);

// Story #6: Suspend user account
router.put('/users/:id/suspend', SuspendUserAccountController.handle);

// Activate user account (utility)
router.put('/users/:id/activate', ActivateUserAccountController.handle);

// Delete user account (utility)
router.delete('/users/:id', DeleteUserAccountController.handle);

// Profile Management Routes (Stories #8-#12)
// Story #9 & #12: View/Search user profiles (list all or filtered)
router.get('/profiles', SearchUserProfilesController.handle);
router.get('/profiles/search', SearchUserProfilesController.handle);

// Story #9: View single user profile by ID
router.get('/profiles/:id', ViewUserProfileController.handle);

// Story #8: Create user profiles
router.post('/profiles', CreateUserProfileController.handle);

// Story #10: Update user profile
router.put('/profiles/:id', UpdateUserProfileController.handle);

// Story #11: Suspend user profile
router.put('/profiles/:id/suspend', SuspendUserProfileController.handle);

// Activate user profile (utility)
router.put('/profiles/:id/activate', ActivateUserProfileController.handle);

// System statistics (utility - not a user story)
router.get('/stats', GetSystemStatsController.handle);

export default router;
