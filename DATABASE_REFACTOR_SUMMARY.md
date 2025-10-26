# Database Refactoring Summary - UserAccount and UserProfile

## Overview

This document summarizes the refactoring work performed to implement the new two-table database design for the CSR Volunteer Matching System.

## Changes Made

### 1. Prisma Schema Updates (`server/prisma/schema.prisma`)

#### New Enum: `UserProfileRole`
```prisma
enum UserProfileRole {
  CSR_REP
  PIN
  USER_ADMIN
  PLATFORM_MANAGER
}
```

#### UserStatus Update
Changed `DEACTIVATED` to `DELETED`:
```prisma
enum UserStatus {
  ACTIVE
  SUSPENDED
  DELETED  // Changed from DEACTIVATED
}
```

#### New Model: `UserProfile`
This table will contain exactly 4 records (one for each role):
```prisma
model UserProfile {
  id          String           @id @default(uuid())
  role        UserProfileRole  @unique
  name        String
  description String?
  permissions Json?
  isActive    Boolean          @default(true)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  userAccounts UserAccount[]
  @@map("user_profiles")
}
```

#### New Model: `UserAccount` (replaces old `User`)
This table holds user personal information and login credentials:
```prisma
model UserAccount {
  id           String       @id @default(uuid())
  email        String       @unique
  password     String
  name         String
  phoneNumber  String?
  address      String?
  dateOfBirth  DateTime?
  status       UserStatus   @default(ACTIVE)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  userProfileId String
  userProfile   UserProfile @relation(fields: [userProfileId], references: [id])
  pin          PIN?
  csrRep       CSRRep?
  platformManager PlatformManager?
  notifications Notification[]
  @@map("user_accounts")
}
```

#### Updated Relations
All other models that previously referenced `User` now reference `UserAccount`:
- `PIN.user` → `PIN.user.UserAccount`
- `CSRRep.user` → `CSRRep.user.UserAccount`
- `PlatformManager.user` → `PlatformManager.user.UserAccount`
- `Notification.user` → `Notification.user.UserAccount`

### 2. Seed File Updates (`server/prisma/seed.ts`)

#### Created 4 UserProfile Records
The seed file now creates exactly 4 user profile records:
1. USER_ADMIN - "User Administrator"
2. PIN - "Person in Need"
3. CSR_REP - "CSR Representative"
4. PLATFORM_MANAGER - "Platform Manager"

#### Updated User Creation
All user accounts are now created using `prisma.userAccount` instead of `prisma.user`, and they reference one of the 4 user profiles via `userProfileId`.

## PlantUML ERD Created

Created a PlantUML diagram showing the new database design: `database-design-proposal.puml`

Generated PNG: `Database Design Proposal - UserAccount and UserProfile.png`

## Benefits of This Design

### 1. Clear Separation of Concerns
- **UserProfile**: Role definition metadata (4 static records)
- **UserAccount**: User personal information and credentials

### 2. Scalability
- New roles can be added by creating new UserProfile records
- User personal data is separated from role definitions

### 3. Maintainability
- Role permissions are stored in a single location (UserProfile)
- Easy to query which users have which roles
- Clear distinction between user accounts and their roles

### 4. Data Integrity
- UserProfile enforces uniqueness on role (only 4 records expected)
- Foreign key relationship ensures all accounts have valid profiles

## Next Steps Required

### 1. Entity Files Update
Update all entity files in `server/src/entities/` to use `UserAccount` instead of `User`:
- `User.entity.ts` → Should reference `UserAccount`
- Create new `UserProfile.entity.ts` for the profile entity

### 2. Controllers Update
Update all controllers that reference the old `User` model:
- Authentication controllers (`login.controller.ts`, etc.)
- User admin controllers (view, create, update, suspend user accounts)
- All places where `prisma.user` is used → should use `prisma.userAccount`

### 3. Database Migration
1. Start Docker database: `docker-compose up -d`
2. Create migration: `npx prisma migrate dev --name useraccount_userprofile_refactor`
3. Run seed: `npm run seed`

### 4. Testing
After updating all code references:
1. Run tests to ensure all functionality works
2. Test authentication for all user types
3. Test user account management (admin features)
4. Verify relationships work correctly

## Important Notes

⚠️ **Breaking Changes**: This is a significant schema change that will affect:
- All authentication logic
- All user management features
- All queries that reference the User model
- JWT token generation (may need to include userProfile info)

⚠️ **Database Reset Required**: Due to the schema change from `User` to `UserAccount`, a database reset will be necessary for development.

## Migration Strategy

1. **Development**: Start fresh with new schema
2. **Backup existing data** if needed before migration
3. Update all controllers and services to use `UserAccount`
4. Update JWT payload if needed to include role from UserProfile
5. Test thoroughly before deploying

## Files Modified

- ✅ `server/prisma/schema.prisma` - Complete refactoring
- ✅ `server/prisma/seed.ts` - Updated seed data
- ⏳ `server/src/entities/*.entity.ts` - Need to be updated
- ⏳ `server/src/controllers/**/*.controller.ts` - Need to be updated
- ⏳ `server/src/middleware/auth.ts` - Need to be updated (if it checks userType)

## Diagram Files

- ✅ `database-design-proposal.puml` - PlantUML source
- ✅ `Database Design Proposal - UserAccount and UserProfile.png` - Visual diagram
