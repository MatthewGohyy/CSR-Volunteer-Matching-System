# User Story 11: Suspend User Profile - Implementation Complete

## Overview
This document describes the implementation of User Story 11, which distinguishes between **User Account** and **User Profile** suspension, following the updated 'Access & Security Concepts'.

---

## Core Concepts

### 1. User Account (Authentication Layer)
- **What it is**: The identity and authentication credentials of a user
- **Status field**: `User.status` in the database
- **When suspended**: User **cannot login** at all
- **Use case**: Complete account suspension (e.g., security violations, policy breaches)

### 2. User Profile (Authorization Layer)
- **What it is**: The role-specific data and permissions (PIN, CSR Rep, Platform Manager)
- **Status field**: `PIN.status`, `CSRRep.status`, `PlatformManager.status` in the database
- **When suspended**: User **can login** but **cannot perform role-specific tasks**
- **Use case**: Temporary suspension of role permissions while maintaining account access (e.g., under review, pending verification)

---

## Changes Made

### 1. Database Schema Changes (`schema.prisma`)

Added new `ProfileStatus` enum:
```prisma
enum ProfileStatus {
  ACTIVE
  SUSPENDED
  DEACTIVATED
}
```

Added `status` field to profile tables:
- `PIN.status: ProfileStatus`
- `CSRRep.status: ProfileStatus`
- `PlatformManager.status: ProfileStatus`

**Migration**: `20251019_add_profile_status/migration.sql`

---

### 2. Backend Entity Updates

#### Created `PlatformManager.entity.ts`
New entity class with:
- Status management methods (`suspend()`, `activate()`)
- Profile status checks (`isActive()`, `isSuspended()`)

#### Updated `PIN.entity.ts` and `CSRRep.entity.ts`
- Added `status: ProfileStatus` field
- Added `suspend()` and `activate()` methods
- Added status checking methods

---

### 3. Controller Updates

#### `SuspendUserProfileController.ts` (Story #11)
**Updated behavior**: Now suspends the **profile** (not the account)
- Determines user type (PIN, CSR_REP, PLATFORM_MANAGER)
- Calls the appropriate profile entity's `suspendByUserId()` method
- User can still login but cannot perform role tasks

#### New: `ActivateUserProfileController.ts`
- Activates a suspended profile
- Restores role-specific permissions
- Endpoint: `PUT /admin/profiles/:id/activate`

---

### 4. Middleware Updates (`auth.ts`)

#### Enhanced `authenticate()` middleware
- Now checks user account status during authentication
- Blocks login if account is SUSPENDED or DEACTIVATED
- Returns clear error messages

#### New `requireActiveProfile()` middleware
- Checks if user's profile is active
- Should be used for role-specific endpoints
- Allows suspended profiles to login but blocks role actions

**Usage example**:
```typescript
// For role-specific actions (e.g., create request, save shortlist)
router.post('/requests', authenticate, requireActiveProfile, authorize(UserType.PIN), createRequest);

// For general actions (e.g., view profile)
router.get('/profile', authenticate, authorize(UserType.PIN), getProfile);
```

---

### 5. Frontend Changes

#### Updated Types (`types/index.ts`)
- Added `ProfileStatus` type
- Updated `PINProfile`, `CSRRepProfile`, `PlatformManagerProfile` interfaces to include `status`

#### Major Update: `UserDetailsModal.tsx`
**New UI Structure** - Two distinct sections:

##### 🔐 User Account Section (Blue)
- Shows account status (ACTIVE/SUSPENDED/DEACTIVATED)
- Displays email and account creation date
- **Actions**:
  - "Suspend Account (Block Login)" - prevents login
  - "Activate Account (Allow Login)" - restores login
- **API calls**: `PUT /admin/users/:id/suspend` or `/activate`

##### 👤 User Profile Section (Purple)
- Shows profile status (ACTIVE/SUSPENDED/DEACTIVATED)
- Only shown for non-admin users with profiles
- **Actions**:
  - "Suspend Profile (Disable Tasks)" - blocks role tasks
  - "Activate Profile (Enable Tasks)" - restores permissions
- **API calls**: `PUT /admin/profiles/:id/suspend` or `/activate`

#### Visual Indicators
- **Account Suspended**: ⚠️ "User cannot login - Account is suspended"
- **Account Active**: ✓ "User can login - Account is active"
- **Profile Suspended**: ⚠️ "User can login but cannot perform role-specific tasks"
- **Profile Active**: ✓ "User can perform all role-specific tasks"

---

## API Endpoints

### User Account Management
- `PUT /admin/users/:id/suspend` - Suspend account (block login)
- `PUT /admin/users/:id/status` - Update account status

### User Profile Management (NEW)
- `PUT /admin/profiles/:id/suspend` - Suspend profile (disable role tasks)
- `PUT /admin/profiles/:id/activate` - Activate profile (enable role tasks)

---

## Testing Scenarios

### Scenario 1: Suspend User Account
1. Admin clicks "Suspend Account (Block Login)" in UserDetailsModal
2. User's `User.status` → SUSPENDED
3. User tries to login → **BLOCKED** with error "Account suspended"
4. User's profile status remains ACTIVE

### Scenario 2: Suspend User Profile
1. Admin clicks "Suspend Profile (Disable Tasks)" in UserDetailsModal
2. User's profile status (PIN/CSRRep/PlatformManager) → SUSPENDED
3. User can still login successfully
4. User tries to create request/save shortlist → **BLOCKED** by `requireActiveProfile` middleware
5. User can view their profile and other non-role-specific pages

### Scenario 3: Both Suspended
1. Both account and profile are suspended
2. User cannot login (blocked at authentication)
3. Profile status is irrelevant since user can't login

### Scenario 4: Reactivation
1. Admin activates account → user can login
2. Admin activates profile → user can perform role tasks
3. Both can be activated independently

---

## Example Use Cases

### Use Case 1: Security Review
**Situation**: A CSR Rep is under investigation for policy violation
**Action**: Suspend their **profile** (not account)
**Result**: 
- They can still login and view information
- They cannot save requests or submit offers
- Investigation can proceed without completely blocking access

### Use Case 2: Account Compromise
**Situation**: A PIN's account may have been hacked
**Action**: Suspend their **account**
**Result**:
- Immediate login block
- Complete protection of the account
- User must contact support to reactivate

### Use Case 3: Pending Verification
**Situation**: A new CSR Rep's company registration needs verification
**Action**: Suspend their **profile** during verification
**Result**:
- They can login and prepare their profile
- They cannot interact with PINs or submit offers
- Profile can be quickly activated once verified

---

## Technical Notes

### Database Migration
- Migration file: `server/prisma/migrations/20251019_add_profile_status/migration.sql`
- Adds `status` column with default value `ACTIVE` to all existing profiles
- Includes indexes for performance

### Backwards Compatibility
- All existing profiles automatically set to `ACTIVE` status
- Existing code that doesn't check profile status will continue to work
- Gradual adoption of `requireActiveProfile` middleware recommended

### Future Enhancements
1. Add audit logging for account/profile status changes
2. Add email notifications when account/profile is suspended
3. Add temporary suspension with auto-reactivation dates
4. Add reasons for suspension (stored in database)
5. Add bulk suspend/activate operations

---

## Files Modified

### Backend
- `server/prisma/schema.prisma` - Added ProfileStatus enum and status fields
- `server/src/entities/PIN.entity.ts` - Added status field and methods
- `server/src/entities/CSRRep.entity.ts` - Added status field and methods
- `server/src/entities/PlatformManager.entity.ts` - NEW FILE
- `server/src/entities/index.entity.ts` - Added PlatformManagerEntity export
- `server/src/controllers/userAdmin/suspendUserProfile.controller.ts` - Complete rewrite
- `server/src/controllers/userAdmin/activateUserProfile.controller.ts` - NEW FILE
- `server/src/routes/admin.ts` - Added activate profile endpoint
- `server/src/middleware/auth.ts` - Enhanced with profile checking

### Frontend
- `client/src/types/index.ts` - Added ProfileStatus type
- `client/src/components/UserDetailsModal.tsx` - Major UI overhaul
- `client/src/components/AdminDashboard.tsx` - Updated to pass onUpdate prop

---

## Summary

✅ **User Story 11 COMPLETE**

The system now properly distinguishes between:
- **Account Suspension** (authentication layer) - blocks login
- **Profile Suspension** (authorization layer) - blocks role-specific tasks

Admins have full control with clear visual indicators and intuitive UI showing both statuses independently.

---

## Questions?

For implementation details or questions, refer to:
- `BCE_ARCHITECTURE.md` - System architecture overview
- `API_DOCUMENTATION.md` - Complete API reference
- `.cursor/rules/project_requirements.mdc` - User stories and requirements

