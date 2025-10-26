# Quick Fix Guide for Remaining Errors

## Current Status
- ✅ Database migration completed
- ✅ Seed data working
- ✅ Core refactoring done
- ⚠️ 172 TypeScript errors remaining

## Main Issue Categories

### 1. Missing Imports (10 CSR Rep files)
Add `import { UserProfileRole } from '@prisma/client';` to:
- All CSR Rep controller files

### 2. Match Controller (Major Refactoring)
File: `src/controllers/match.controller.ts`

This file needs significant updates due to schema changes. Main issues:
- Old Prisma relation references (`prisma.pIN`, `prisma.user`)
- Include paths that don't exist anymore
- Property access on non-existent relations

**Options:**
1. Comment out match controller temporarily
2. Fully refactor to use new schema
3. Keep for later - less critical endpoint

### 3. User Admin Controllers
Issues with:
- Duplicate imports
- References to `UserType` (no longer exists)
- Old Prisma client calls
- References to non-existent entity methods

### 4. CSR Rep Update Profile
Line 30: Reference to `CSRRepEntity` that doesn't exist
**Fix:** Change to `UserAccountEntity.updateCSRRepProfile()`

## Recommended Actions

### Immediate (Server can run)
```bash
# 1. Add imports to CSR Rep files
cd server
for file in src/controllers/csrRep/*.ts; do
  if ! grep -q "UserProfileRole" "$file"; then
    sed -i '' '/^import {/a\
import { UserProfileRole } from "@prisma/client";
' "$file"
  fi
done

# 2. Start server (may have runtime errors on some endpoints)
npm run dev
```

### Short-term (Fix critical endpoints)
1. Fix CSR Rep update profile
2. Comment out match controller
3. Fix User Admin imports

### Long-term (Complete refactoring)
1. Fully update match controller
2. Complete User Admin refactoring
3. Test all endpoints

## Testing Strategy

1. Start with auth endpoints (login, register) - these should work
2. Test PIN profile operations
3. Test CSR Rep operations (may need fixes)
4. Skip match operations temporarily
5. Test User Admin operations after fixes

