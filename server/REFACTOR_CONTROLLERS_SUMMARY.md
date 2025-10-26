# Controller Refactoring Summary

## Overview
All controllers need to be updated to use `UserAccountEntity` instead of the old entity classes:
- `UserEntity` → `UserAccountEntity`
- `PINEntity` → `UserAccountEntity`
- `CSRRepEntity` → `UserAccountEntity`
- `PlatformManagerEntity` → `UserAccountEntity`

## Key Changes Required

### 1. Import Updates
**Before:**
```typescript
import { UserEntity } from '../../entities/User.entity';
import { PINEntity } from '../../entities/PIN.entity';
import { CSRRepEntity } from '../../entities/CSRRep.entity';
import { PlatformManagerEntity } from '../../entities/PlatformManager.entity';
```

**After:**
```typescript
import { UserAccountEntity } from '../../entities/UserAccount.entity';
import { UserProfileRole } from '@prisma/client';
```

### 2. Method Call Updates

#### Finding Users
**Before:**
```typescript
const user = await UserEntity.findByEmail(email);
const user = await UserEntity.findById(id);
const pin = await PINEntity.findByUserId(userId);
const csrRep = await CSRRepEntity.findByUserId(userId);
```

**After:**
```typescript
const user = await UserAccountEntity.findByEmail(email);
const user = await UserAccountEntity.findById(id);
const pin = await UserAccountEntity.findByUserIdWithRole(userId, UserProfileRole.PIN);
const csrRep = await UserAccountEntity.findByUserIdWithRole(userId, UserProfileRole.CSR_REP);
```

#### Updating Profiles
**Before:**
```typescript
const updated = await PINEntity.updateByUserId(userId, updateData);
const updated = await CSRRepEntity.updateByUserId(userId, updateData);
const updated = await PlatformManagerEntity.updateByUserId(userId, updateData);
```

**After:**
```typescript
const updated = await UserAccountEntity.updatePINProfile(userId, updateData);
const updated = await UserAccountEntity.updateCSRRepProfile(userId, updateData);
const updated = await UserAccountEntity.updatePlatformManagerProfile(userId, updateData);
```

#### Suspending Profiles
**Before:**
```typescript
await PINEntity.suspendByUserId(userId);
await CSRRepEntity.suspendByUserId(userId);
await PlatformManagerEntity.suspendByUserId(userId);
```

**After:**
```typescript
await UserAccountEntity.suspendProfile(userId);
```

#### Activating Profiles
**Before:**
```typescript
await PINEntity.activateByUserId(userId);
await CSRRepEntity.activateByUserId(userId);
await PlatformManagerEntity.activateByUserId(userId);
```

**After:**
```typescript
await UserAccountEntity.activateProfile(userId);
```

### 3. Response Data Structure Changes

**Before:** Direct entity object
```typescript
res.json({ profile: pin });
```

**After:** Extract relevant fields
```typescript
res.json({ 
  profile: {
    id: user.id,
    name: user.name,
    age: user.age,
    location: user.location,
    // ... other relevant fields for PIN
  }
});
```

### 4. Token Generation Changes

**Before:**
```typescript
const token = generateToken({
  userId: user.id,
  email: user.email,
  userType: user.userType, // No longer exists
});
```

**After:**
```typescript
const role = user.getRole();
const token = generateToken({
  userId: user.id,
  email: user.email,
  role, // Get from userProfile
});
```

### 5. Accessing Profile Data

**Before:**
```typescript
user.pin?.name
user.csrRep?.companyName
```

**After:**
```typescript
// For PIN:
user.name
user.age
user.location

// For CSR Rep:
user.name
user.companyName
user.companyRegistrationNumber
```

## Files That Need Updates (42 total)

### Auth Controllers (5 files)
- ✅ login.controller.ts
- ⏳ updatePassword.controller.ts
- ⏳ registerPIN.controller.ts  
- ⏳ registerCSRRep.controller.ts
- ⏳ getProfile.controller.ts

### PIN Controllers (16 files)
- ✅ getProfile.controller.ts
- ✅ updateProfile.controller.ts
- ⏳ createRequest.controller.ts
- ⏳ viewMyRequests.controller.ts
- ⏳ updateRequest.controller.ts
- ⏳ deleteRequest.controller.ts
- ⏳ searchMyRequests.controller.ts
- ⏳ viewRequestViews.controller.ts
- ⏳ viewRequestShortlists.controller.ts
- ⏳ viewCompletedRequests.controller.ts
- ⏳ searchCompletedRequests.controller.ts
- ⏳ viewMatches.controller.ts

### CSR Rep Controllers (9 files)
- ⏳ updateProfile.controller.ts
- ⏳ searchRequests.controller.ts
- ⏳ viewRequests.controller.ts
- ⏳ saveRequest.controller.ts
- ⏳ viewShortlist.controller.ts
- ⏳ searchShortlist.controller.ts
- ⏳ removeShortlist.controller.ts
- ⏳ submitOffer.controller.ts
- ⏳ viewOffers.controller.ts
- ⏳ viewMatches.controller.ts
- ⏳ viewCompletedRequests.controller.ts
- ⏳ searchCompletedRequests.controller.ts

### User Admin Controllers (12 files)
- ⏳ All userAdmin controllers

## Automated Update Script

Due to the large number of files, consider using find/replace:

```bash
# Replace imports
find server/src/controllers -type f -name "*.ts" -exec sed -i '' 's/from.*User\.entity/from "..\/..\/entities\/UserAccount.entity"/g' {} \;
find server/src/controllers -type f -name "*.ts" -exec sed -i '' 's/from.*PIN\.entity/from "..\/..\/entities\/UserAccount.entity"/g' {} \;
find server/src/controllers -type f -name "*.ts" -exec sed -i '' 's/from.*CSRRep\.entity/from "..\/..\/entities\/UserAccount.entity"/g' {} \;
find server/src/controllers -type f -name "*.ts" -exec sed -i '' 's/from.*PlatformManager\.entity/from "..\/..\/entities\/UserAccount.entity"/g' {} \;

# Replace entity references
find server/src/controllers -type f -name "*.ts" -exec sed -i '' 's/UserEntity\./UserAccountEntity./g' {} \;
find server/src/controllers -type f -name "*.ts" -exec sed -i '' 's/PINEntity\./UserAccountEntity./g' {} \;
find server/src/controllers -type f -name "*.ts" -exec sed -i '' 's/CSRRepEntity\./UserAccountEntity./g' {} \;
find server/src/controllers -type f -name "*.ts" -exec sed -i '' 's/PlatformManagerEntity\./UserAccountEntity./g' {} \;
```

## Next Steps

1. Run the automated update script
2. Manually fix method calls (findByUserId → findByUserIdWithRole, etc.)
3. Update response data structures
4. Test each controller
5. Run database migration
6. Update seed data
7. Remove old entity files

