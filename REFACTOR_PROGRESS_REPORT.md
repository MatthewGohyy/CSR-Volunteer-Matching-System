# Database Refactoring Progress Report

## Summary

We have successfully refactored the database schema to implement the new two-table design with `UserAccount` and `UserProfile`. This separates user identity from role/authorization context.

## ✅ Completed Tasks

### 1. Schema Refactoring
- **File**: `server/prisma/schema.prisma`
- **Status**: ✅ Complete
- **Changes**:
  - Removed old `UserType` enum
  - Added `UserProfileRole` enum (CSR_REP, PIN, USER_ADMIN, PLATFORM_MANAGER)
  - Created new `UserProfile` model (expected to have 4 records)
  - Created new `UserAccount` model (replaces old `User`)
  - Updated all relations to reference `UserAccount`
  - Updated `UserStatus` enum (changed DEACTIVATED to DELETED)

### 2. Seed Data Updates
- **File**: `server/prisma/seed.ts`
- **Status**: ✅ Complete
- **Changes**:
  - Creates 4 UserProfile records (one for each role)
  - Updated all user account creation to use `prisma.userAccount`
  - Added `userProfileId` reference to each account
  - Populated permissions for each profile

### 3. New Entity Classes Created
- **Files**: 
  - `server/src/entities/UserAccount.entity.ts` ✅
  - `server/src/entities/UserProfile.entity.ts` ✅
- **Status**: ✅ Complete
- **Details**:
  - `UserAccountEntity` - Handles all user account operations
  - `UserProfileEntity` - Handles all user profile/role operations
  - Both entities follow BCE pattern with business logic methods

### 4. Documentation
- **Files**: 
  - `DATABASE_REFACTOR_SUMMARY.md` ✅
  - `database-design-proposal.puml` ✅
  - `Database Design Proposal - UserAccount and UserProfile.png` ✅
- **Status**: ✅ Complete

## ⏳ Pending Tasks

### 1. Database Migration
- **Status**: ⏳ Blocked (Docker needs to be started)
- **Requirements**: 
  - Start Docker: `docker-compose up -d`
  - Run: `npx prisma migrate dev --name useraccount_userprofile_refactor`
  - Seed database: `npm run seed`

### 2. Update Controllers
- **Status**: ⏳ Not Started
- **Affected Files**:
  - All controllers in `server/src/controllers/`
  - Need to replace `prisma.user` with `prisma.userAccount`
  - Update authentication to check `userProfile.role` instead of `user.userType`

### 3. Update Middleware
- **Status**: ⏳ Not Started
- **Files**:
  - `server/src/middleware/auth.ts`
  - Update JWT payload structure if needed
  - Update authorization checks

### 4. Update DTOs
- **Status**: ⏳ Not Started
- **Files**: `server/src/dto/index.ts`
  - Update DTOs to reference new models

### 5. Testing
- **Status**: ⏳ Waiting for migration
- **Steps**:
  1. Run tests after controller updates
  2. Test authentication for all user types
  3. Test admin features (user management)
  4. Verify database queries work correctly

## 📋 Files Modified

### Schema & Database
- ✅ `server/prisma/schema.prisma` - Complete refactor
- ✅ `server/prisma/seed.ts` - Updated seed data
- ⏳ Database migration - Pending Docker startup

### Entities
- ✅ `server/src/entities/UserAccount.entity.ts` - Created
- ✅ `server/src/entities/UserProfile.entity.ts` - Created
- ✅ `server/src/entities/index.ts` - Updated exports
- ⏳ Update other entity files to use UserAccount

### Controllers
- ⏳ `server/src/controllers/auth/*.controller.ts` - Need updates
- ⏳ `server/src/controllers/userAdmin/*.controller.ts` - Need updates
- ⏳ `server/src/controllers/pin/*.controller.ts` - Need updates
- ⏳ `server/src/controllers/csrRep/*.controller.ts` - Need updates
- ⏳ `server/src/controllers/platformManager/*.controller.ts` - Need updates

### Middleware & Utilities
- ⏳ `server/src/middleware/auth.ts` - Need updates
- ⏳ `server/src/middleware/validation.ts` - May need updates
- ⏳ `server/src/utils/jwt.ts` - May need updates

## 🔄 Migration Strategy

### Phase 1: Schema & Entity Layer ✅ COMPLETE
1. ✅ Update Prisma schema
2. ✅ Create entity classes
3. ✅ Update seed file
4. Generate Prisma client

### Phase 2: Database Migration ⏳ BLOCKED
1. Start Docker database
2. Create migration file
3. Apply migration
4. Run seed to populate data

### Phase 3: Controller Updates ⏳ PENDING
1. Update authentication controllers
2. Update user admin controllers
3. Update PIN controllers
4. Update CSR Rep controllers
5. Update platform manager controllers

### Phase 4: Testing ⏳ PENDING
1. Test authentication flow
2. Test user management
3. Test all user stories
4. Fix any bugs

## 🔑 Key Changes

### Old Model (User)
```typescript
model User {
  id       String    @id @default(uuid())
  email    String    @unique
  password String
  userType UserType  // PIN, CSR_REP, ADMIN, PLATFORM_MANAGER
  status   UserStatus
}
```

### New Models (UserAccount + UserProfile)
```typescript
model UserProfile {
  id          String           @id @default(uuid())
  role        UserProfileRole  @unique  // Only 4 records!
  name        String
  description String?
  permissions Json?
  isActive    Boolean
}

model UserAccount {
  id           String       @id @default(uuid())
  email        String       @unique
  password     String
  name         String
  userProfileId String      // Links to one of 4 roles
  status       UserStatus
}
```

## 🎯 Benefits

1. **Clear Separation**: User identity vs. role/authorization
2. **Scalable**: Can add new roles without changing accounts
3. **Maintainable**: Role permissions stored in one place
4. **Type Safety**: Prisma ensures referential integrity
5. **Flexible**: Can have multiple accounts with same role

## ⚠️ Breaking Changes

1. All `User` references must become `UserAccount`
2. All `userType` checks must become `userProfile.role` checks
3. JWT tokens may need to include role from profile
4. Database will need reset for development

## 📝 Next Steps

1. **Start Docker**: `docker-compose up -d`
2. **Create Migration**: `cd server && npx prisma migrate dev --name useraccount_userprofile_refactor`
3. **Update Controllers**: Replace all `prisma.user` with `prisma.userAccount`
4. **Update Auth**: Check `userProfile.role` instead of `user.userType`
5. **Test**: Run all tests to ensure functionality works

## 🔍 Files to Update

Search for these patterns throughout the codebase:
- `prisma.user.` → `prisma.userAccount.`
- `userType` → `userProfile.role`
- `UserType.` → `UserProfileRole.`
- `.include({ pin, csrRep, platformManager })` → `.include({ userProfile, pin, csrRep, platformManager })`

Estimated files to update: ~50+ files
