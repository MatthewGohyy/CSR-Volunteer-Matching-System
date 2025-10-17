# Controller Reorganization Summary

This document outlines the complete reorganization of controllers in the CSR Volunteer Matching System. The goal was to separate user story methods into individual controllers while keeping utility methods organized.

## Organizational Principle

**Main Rule**: Each user story should have its own dedicated controller file. Utility methods (like statistics, getting categories, etc.) can remain in main controller files or be organized separately.

## Directory Structure

```
controllers/
├── admin.controller.ts                    # LEGACY - See userAdmin/ subdirectory
├── auth.controller.ts                     # LEGACY - See auth/ subdirectory
├── csrRep.controller.ts                   # LEGACY - See csrRep/ subdirectory
├── pin.controller.ts                      # LEGACY - See pin/ subdirectory
├── request.controller.ts                  # LEGACY - See pin/ and csrRep/ subdirectories
├── platformManager.controller.ts          # ACTIVE - Only utility methods (stats, profile)
├── match.controller.ts                    # ACTIVE - Matching logic (not user stories)
├── template.controller.ts                 # ACTIVE - Template controller
│
├── auth/                                   # Authentication controllers
│   ├── login.controller.ts                # ✅ User Story: Login
│   ├── logout.controller.ts               # ✅ User Story: Logout
│   ├── registerPIN.controller.ts          # ✅ NEW - User Story: Register as PIN
│   ├── registerCSRRep.controller.ts       # ✅ NEW - User Story: Register as CSR Rep
│   ├── getProfile.controller.ts           # ✅ NEW - User Story: Get my profile
│   └── updatePassword.controller.ts       # ✅ NEW - User Story: Update password
│
├── userAdmin/                              # Admin user management controllers
│   ├── createUserAccount.controller.ts    # ✅ User Story #3: Create user account
│   ├── viewUserAccounts.controller.ts     # ✅ User Story #4: View user accounts
│   ├── updateUserAccount.controller.ts    # ✅ User Story #5: Update user account
│   ├── suspendUserAccount.controller.ts   # ✅ User Story #6: Suspend user account
│   ├── searchUserAccounts.controller.ts   # ✅ User Story #7: Search user accounts
│   ├── createUserProfile.controller.ts    # ✅ User Story #8: Create user profile
│   ├── viewUserProfiles.controller.ts     # ✅ User Story #9: View user profiles
│   ├── updateUserProfile.controller.ts    # ✅ User Story #10: Update user profile
│   ├── suspendUserProfile.controller.ts   # ✅ User Story #11: Suspend user profile
│   └── searchUserProfiles.controller.ts   # ✅ User Story #12: Search user profiles
│
├── pin/                                    # PIN (Person in Need) controllers
│   ├── createRequest.controller.ts        # ✅ User Story #15: Create request
│   ├── viewMyRequests.controller.ts       # ✅ User Story #16: View my requests
│   ├── updateRequest.controller.ts        # ✅ User Story #17: Update request
│   ├── deleteRequest.controller.ts        # ✅ User Story #18: Delete request
│   ├── searchMyRequests.controller.ts     # ✅ User Story #19: Search my requests
│   ├── viewRequestViews.controller.ts     # ✅ User Story #20: View request views count
│   ├── viewRequestShortlists.controller.ts # ✅ User Story #21: View request shortlists
│   ├── viewCompletedRequests.controller.ts # ✅ User Story: View completed requests
│   ├── searchCompletedRequests.controller.ts # ✅ User Story: Search completed requests
│   ├── getProfile.controller.ts           # ✅ NEW - User Story: View my PIN profile
│   ├── updateProfile.controller.ts        # ✅ NEW - User Story: Update my PIN profile
│   ├── viewMatches.controller.ts          # ✅ NEW - User Story: View my matches
│   ├── getNotifications.controller.ts     # ✅ NEW - User Story: View notifications
│   ├── markNotificationRead.controller.ts # ✅ NEW - User Story: Mark notification as read
│   └── markAllNotificationsRead.controller.ts # ✅ NEW - User Story: Mark all notifications read
│
├── csrRep/                                 # CSR Representative controllers
│   ├── viewRequests.controller.ts         # ✅ User Story #26: View requests
│   ├── searchRequests.controller.ts       # ✅ User Story #27: Search requests
│   ├── saveRequest.controller.ts          # ✅ User Story: Shortlist/save request
│   ├── viewShortlist.controller.ts        # ✅ User Story: View shortlisted requests
│   ├── searchShortlist.controller.ts      # ✅ User Story: Search shortlisted requests
│   ├── viewCompletedRequests.controller.ts # ✅ User Story: View completed requests
│   ├── searchCompletedRequests.controller.ts # ✅ User Story: Search completed requests
│   ├── removeShortlist.controller.ts      # ✅ NEW - User Story: Remove from shortlist
│   ├── submitOffer.controller.ts          # ✅ NEW - User Story: Submit volunteer offer
│   ├── viewOffers.controller.ts           # ✅ NEW - User Story: View my offers
│   ├── viewMatches.controller.ts          # ✅ NEW - User Story: View my matches
│   └── updateProfile.controller.ts        # ✅ NEW - User Story: Update CSR Rep profile
│
└── platformManager/                        # Platform Manager controllers
    ├── createCategory.controller.ts       # ✅ User Story #35: Create category
    ├── viewCategories.controller.ts       # ✅ User Story #36: View categories
    ├── updateCategory.controller.ts       # ✅ User Story #37: Update category
    ├── deleteCategory.controller.ts       # ✅ User Story #38: Delete category
    └── searchCategories.controller.ts     # ✅ User Story #39: Search categories
```

## New Controllers Created (15 total)

### Auth Controllers (4 new)
1. `auth/registerPIN.controller.ts` - Register as Person in Need
2. `auth/registerCSRRep.controller.ts` - Register as CSR Representative
3. `auth/getProfile.controller.ts` - Get current user profile
4. `auth/updatePassword.controller.ts` - Update user password

### PIN Controllers (6 new)
1. `pin/getProfile.controller.ts` - View PIN profile
2. `pin/updateProfile.controller.ts` - Update PIN profile
3. `pin/viewMatches.controller.ts` - View matched opportunities
4. `pin/getNotifications.controller.ts` - View notifications
5. `pin/markNotificationRead.controller.ts` - Mark single notification as read
6. `pin/markAllNotificationsRead.controller.ts` - Mark all notifications as read

### CSR Rep Controllers (5 new)
1. `csrRep/removeShortlist.controller.ts` - Remove request from shortlist
2. `csrRep/submitOffer.controller.ts` - Submit volunteer offer
3. `csrRep/viewOffers.controller.ts` - View submitted offers
4. `csrRep/viewMatches.controller.ts` - View matched opportunities
5. `csrRep/updateProfile.controller.ts` - Update CSR Rep profile

## Legacy Controllers

The following main controller files are now marked as **LEGACY** and kept only for backward compatibility:

### admin.controller.ts
- ⚠️ All user account/profile methods → Moved to `userAdmin/` subdirectory
- ✅ Active: `getSystemStats()` - System statistics (utility method)
- ⚠️ Legacy: `deleteUser()` - To be deprecated

### auth.controller.ts
- ⚠️ All authentication methods → Should be moved to `auth/` subdirectory
- Legacy methods: `registerPIN`, `registerCSRRep`, `getProfile`, `updatePassword`

### csrRep.controller.ts
- ⚠️ All methods → Moved to `csrRep/` subdirectory
- Legacy methods: `shortlistRequest`, `removeShortlist`, `getShortlists`, `submitOffer`, `getMyOffers`, `getMyMatches`, `updateProfile`

### pin.controller.ts
- ⚠️ All methods → Should be moved to `pin/` subdirectory
- Legacy methods: `getProfile`, `updateProfile`, `getMyMatches`, `getNotifications`, `markNotificationRead`, `markAllNotificationsRead`, `getCompletedRequests`, `searchCompletedRequests`

### request.controller.ts
- ⚠️ Most CRUD methods → Moved to `pin/` and `csrRep/` subdirectories
- ✅ Active: `getCategories()` - Utility method for getting service categories

## Active Controllers (Non-Legacy)

These controllers contain utility methods and remain active:

1. **platformManager.controller.ts**
   - `getPlatformStats()` - Platform statistics (daily/weekly/monthly reports)
   - `getProfile()` - Get platform manager profile
   - `updateProfile()` - Update platform manager profile

2. **match.controller.ts**
   - Contains matching algorithm logic (not user stories)

3. **template.controller.ts**
   - Template controller for creating new controllers

## Migration Guide for Routes

### Before (Legacy):
```typescript
import { AdminController } from '../controllers/admin.controller';
router.get('/users', AdminController.getUsers);
```

### After (New):
```typescript
import { ViewUserAccountsController } from '../controllers/userAdmin/viewUserAccounts.controller';
router.get('/users', ViewUserAccountsController.handle);
```

## Benefits of This Organization

1. **Clear Separation**: Each user story has its own file
2. **Easy to Find**: Controller names match user story descriptions
3. **Single Responsibility**: Each controller does one thing
4. **Testable**: Easier to write unit tests for individual controllers
5. **Maintainable**: Changes to one user story don't affect others
6. **Scalable**: Easy to add new user stories without bloating existing files
7. **Documentation**: File structure serves as documentation

## Next Steps

1. ✅ Mark legacy methods in main controllers with deprecation notices
2. ⚠️ Update route files to use new controllers
3. ⚠️ Update tests to use new controllers
4. ⚠️ Test all endpoints to ensure functionality is preserved
5. 🔮 Future: Remove legacy controllers once all routes are migrated

## Testing Checklist

After migrating routes, test these endpoints:

### Auth Endpoints
- [ ] POST /api/auth/register/pin
- [ ] POST /api/auth/register/csr-rep
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/profile
- [ ] PUT /api/auth/password

### PIN Endpoints
- [ ] GET /api/pin/profile
- [ ] PUT /api/pin/profile
- [ ] GET /api/pin/matches
- [ ] GET /api/pin/notifications
- [ ] PUT /api/pin/notifications/:id/read
- [ ] PUT /api/pin/notifications/read-all

### CSR Rep Endpoints
- [ ] POST /api/csr-rep/shortlist
- [ ] DELETE /api/csr-rep/shortlist/:requestId
- [ ] POST /api/csr-rep/offers
- [ ] GET /api/csr-rep/offers
- [ ] GET /api/csr-rep/matches
- [ ] PUT /api/csr-rep/profile

### Admin Endpoints
- [ ] All user account management endpoints
- [ ] All user profile management endpoints
- [ ] GET /api/admin/stats

### Platform Manager Endpoints
- [ ] All category management endpoints
- [ ] GET /api/platform-manager/stats
- [ ] GET /api/platform-manager/profile
- [ ] PUT /api/platform-manager/profile

## Notes

- Legacy controllers are kept for backward compatibility
- All new development should use individual controllers
- Utility methods (stats, categories) can remain in main controllers
- Each controller exports a class with a static `handle` method
- All controllers follow the same pattern for consistency
