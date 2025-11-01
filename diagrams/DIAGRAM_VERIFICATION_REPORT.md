# Diagram Verification Report

**Date:** October 29, 2025  
**Verified By:** Cascade AI  
**Status:** ⚠️ CRITICAL ISSUES FOUND

---

## Executive Summary

After thorough analysis of all diagrams against the actual codebase (Prisma schema and entity implementations), I found **CRITICAL DISCREPANCIES** in the class diagrams that misrepresent the actual system architecture.

### Verification Checklist
- ✅ ERD Diagrams (PlantUML & Mermaid) - **CORRECT**
- ❌ Class Diagram (Mermaid) - **INCORRECT**
- ⚠️ Class Diagram (PlantUML) - **PARTIALLY INCORRECT**

---

## 🔴 CRITICAL ISSUES

### Issue #1: Non-Existent Entity Classes in Mermaid Class Diagram

**File:** `class-diagram.mmd`  
**Severity:** CRITICAL  
**Impact:** Diagram shows architecture that doesn't exist in codebase

#### Problem
The mermaid class diagram (lines 122-193) shows separate classes:
- `PIN`
- `CSRRep` 
- `PlatformManager`

**These classes DO NOT exist in the actual codebase.**

#### What Actually Exists
The system uses **Single Table Inheritance** with:
- `UserAccount` entity (single class with role-specific nullable fields)
- `UserProfile` entity (4 static records for roles)

**No separate PIN, CSRRep, or PlatformManager entity classes exist.**

#### Evidence from Codebase
```
server/src/entities/
├── UserAccount.entity.ts    ✅ EXISTS
├── UserProfile.entity.ts     ✅ EXISTS
├── PIN.entity.ts            ❌ DOES NOT EXIST
├── CSRRep.entity.ts         ❌ DOES NOT EXIST
└── PlatformManager.entity.ts ❌ DOES NOT EXIST
```

#### Code Proof
From `UserAccount.entity.ts`:
```typescript
export class UserAccountEntity implements PrismaUserAccount {
  // Core fields
  id: string;
  email: string;
  
  // PIN-specific fields (nullable)
  age: number | null;
  location: string | null;
  
  // CSR Rep-specific fields (nullable)
  companyName: string | null;
  companyRegistrationNumber: string | null;
  
  // Platform Manager-specific fields (nullable)
  department: string | null;
}
```

All role-specific fields are in **ONE class** with nullable types.

---

### Issue #2: Incorrect Field Name in Notification

**Files:** `class-diagram.mmd`, `class-diagram.puml`, `erd-diagram.mmd`  
**Severity:** MEDIUM  
**Impact:** Diagrams show wrong field name

#### Problem
Diagrams show: `userAccountId`  
Actual schema uses: `userId`

#### Evidence
**Prisma Schema (schema.prisma:189):**
```prisma
model Notification {
  id        String           @id @default(uuid())
  userId    String           ← ACTUAL FIELD NAME
  ...
}
```

**Entity Implementation (Notification.entity.ts:12):**
```typescript
export class NotificationEntity implements PrismaNotification {
  userId: string;  ← ACTUAL FIELD NAME
  ...
}
```

---

### Issue #3: Incorrect ProfileStatus Enum Value

**Files:** `class-diagram.mmd`, `class-diagram.puml`, `erd-diagram.puml`  
**Severity:** LOW  
**Impact:** Diagrams show wrong enum value

#### Problem
Diagrams show: `DELETED` or `SUSPENDED` as ProfileStatus enum values  
Actual schema uses: `DEACTIVATED`

#### Evidence
**Prisma Schema (schema.prisma:17-21):**
```prisma
enum ProfileStatus {
  ACTIVE
  SUSPENDED
  DEACTIVATED  ← ACTUAL VALUE (not DELETED)
}
```

**Note:** `UserStatus` uses `DELETED`, but `ProfileStatus` uses `DEACTIVATED`.

---

## ✅ CORRECT DIAGRAMS

### ERD Diagrams - Both Correct ✅

**Files:** `erd-diagram.puml`, `erd-diagram.mmd`

Both ERD diagrams **correctly** represent the single-table inheritance pattern:
- Single `UserAccount` table with all role-specific fields
- References to `UserProfile` (4 static records)
- All relationships properly mapped
- Field names match schema (except minor Notification issue)

**Note on erd-diagram.mmd:** Uses `userAccountId` for Notification (line 113) but schema uses `userId`. This is minor since ERD is otherwise correct.

---

## 📊 DETAILED COMPARISON

### UserAccount/UserProfile Architecture

| Aspect | Diagrams Say | Reality | Status |
|--------|--------------|---------|--------|
| **Entity Classes** | PIN, CSRRep, PlatformManager classes exist | Only UserAccount + UserProfile exist | ❌ WRONG |
| **Inheritance** | Separate classes inherit from UserAccount | Single table with nullable fields | ❌ WRONG |
| **Table Structure** | Multiple tables (ERD correct) | Single user_accounts table | ✅ ERD CORRECT |
| **Role Storage** | UserProfileRole enum | UserProfile.name (string) | ⚠️ UNCLEAR |

### Field Accuracy Check

| Entity | Field | Diagram | Schema | Status |
|--------|-------|---------|--------|--------|
| Notification | User Reference | userAccountId | userId | ❌ |
| UserAccount | Profile Status | DELETED | DEACTIVATED | ❌ |
| UserProfile | Role | UserProfileRole enum | name (string) | ⚠️ |
| Request | All fields | ✅ | ✅ | ✅ |
| Match | All fields | ✅ | ✅ | ✅ |
| Shortlist | All fields | ✅ | ✅ | ✅ |
| VolunteerOffer | All fields | ✅ | ✅ | ✅ |
| ServiceCategory | All fields | ✅ | ✅ | ✅ |

---

## 🔍 ARCHITECTURAL PATTERN VERIFICATION

### Single Table Inheritance Pattern

**Status:** ✅ Implemented Correctly in Code, ❌ Incorrectly Shown in Class Diagram

#### What's Implemented:
```
user_accounts table:
├── id, email, password, name (common fields)
├── age, location, accessibilityNeeds (PIN fields - nullable)
├── companyName, industry (CSR fields - nullable)
└── department (Platform Manager field - nullable)
```

#### What Class Diagram Shows (INCORRECT):
```
UserAccount (base class)
├── PIN (extends UserAccount) ← DOES NOT EXIST
├── CSRRep (extends UserAccount) ← DOES NOT EXIST
└── PlatformManager (extends UserAccount) ← DOES NOT EXIST
```

---

## 📝 RECOMMENDATIONS

### Priority 1: Fix Mermaid Class Diagram
**Remove the non-existent entity classes:**
- Delete `class PIN` (lines 122-146)
- Delete `class CSRRep` (lines 148-175)
- Delete `class PlatformManager` (lines 177-192)
- Update relationships to show UserAccount only

### Priority 2: Fix Notification Field Name
**Update all diagrams:**
- Change `userAccountId` → `userId`
- Files: class-diagram.mmd, class-diagram.puml, erd-diagram.mmd

### Priority 3: Fix ProfileStatus Enum
**Update all diagrams:**
- ProfileStatus enum: Change `DELETED` → `DEACTIVATED`
- Files: class-diagram.puml, erd-diagram.puml

### Priority 4: Clarify UserProfile Role
The schema uses `name` as a string, but diagrams reference `UserProfileRole` enum. This should be clarified or the enum should be removed from diagrams.

---

## 📋 FILES REQUIRING UPDATES

| File | Priority | Issues |
|------|----------|--------|
| `class-diagram.mmd` | 🔴 CRITICAL | Remove non-existent classes, fix Notification field |
| `class-diagram.puml` | 🟡 HIGH | Fix Notification field, ProfileStatus enum |
| `erd-diagram.mmd` | 🟢 LOW | Fix Notification field name |
| `erd-diagram.puml` | 🟢 LOW | ProfileStatus enum value |

---

## ✅ VERIFICATION METHODOLOGY

1. **Schema Review:** Analyzed `server/prisma/schema.prisma` (198 lines)
2. **Entity Review:** Examined all entity files in `server/src/entities/`
3. **Diagram Review:** Compared all 4 diagram files against implementation
4. **Cross-Reference:** Verified relationships and field names
5. **Directory Structure:** Confirmed no additional entity files exist

---

## 🎯 CONCLUSION

The **ERD diagrams are accurate** and correctly represent the database structure using single-table inheritance.

The **Mermaid class diagram has critical errors** showing entity classes (PIN, CSRRep, PlatformManager) that don't exist in the codebase. This is misleading and should be fixed immediately.

**Next Steps:**
1. Delete non-existent classes from mermaid class diagram
2. Correct field names (userId vs userAccountId)
3. Fix enum values (DEACTIVATED vs DELETED)
4. Verify all diagrams match the actual implementation

---

**Verification Status:** FAILED ❌  
**Action Required:** YES - Critical fixes needed in class diagrams
