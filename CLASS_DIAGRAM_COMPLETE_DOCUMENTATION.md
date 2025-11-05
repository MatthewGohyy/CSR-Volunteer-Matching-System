# Complete Class Diagram Documentation
**CSR Volunteer Matching System**

**Date:** November 5, 2025  
**Status:** Authoritative Reference After Cleanup

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Pattern](#architecture-pattern)
3. [Entity Relationship Map](#entity-relationship-map)
4. [Detailed Entity Documentation](#detailed-entity-documentation)
5. [Method Reference](#method-reference)
6. [Data Flow Patterns](#data-flow-patterns)
7. [Verification Checklist](#verification-checklist)

---

## System Overview

The CSR Volunteer Matching System connects **Persons-In-Need (PINs)** with **Corporate Social Responsibility Representatives (CSR Reps)** through a matching platform managed by **Platform Managers** and **User Administrators**.

### Core Entities (8 Total)

1. **UserProfile** - Role definitions (4 static records)
2. **UserAccount** - All users (Single Table Inheritance)
3. **RequestCategory** - Categorization for requests
4. **Request** - Help requests from PINs
5. **Shortlist** - CSR Reps' saved requests
6. **VolunteerOffer** - CSR Reps' offers to help
7. **Match** - Confirmed PIN-CSR pairings
8. **Notification** - System notifications

### Instance Methods (4 Total Across All Entities)

- **UserAccount.getRole()** - Returns profile name
- **UserAccount.toJSON()** - Serialization with date formatting
- **Request.toJSON()** - Serialization with date formatting

### Static Methods (74 Total Across All Entities)

All database operations use static methods following the BCE (Boundary-Controller-Entity) pattern.

---

## Architecture Pattern

### BCE Framework
- **Boundary**: Routes and middleware handle HTTP requests
- **Controller**: Controllers orchestrate business logic
- **Entity**: Entities handle ALL database operations

### Single Table Inheritance (UserAccount)
All user types share one table with role-specific nullable fields:
- **PIN**: `age`, `location`, `accessibilityNeeds`, `profilePhoto`
- **CSR Rep**: `companyName`, `companyRegistrationNumber`, `industry`, `contactPerson`, `companyAddress`, `companyLogo`
- **Platform Manager**: `department`
- **User Admin**: No special fields

Role is determined by `userProfileId` foreign key to UserProfile.

### Why No Instance Methods for Most Entities?
Instance methods were removed during cleanup because:
1. Controllers call static methods directly (e.g., `Request.create()`)
2. No object-oriented behavior needed beyond construction
3. Direct property access is simpler than getter methods
4. Database filtering is more efficient than instance filtering

**Exception**: `toJSON()` methods handle date serialization for API responses.

---

## Entity Relationship Map

```
UserProfile (1) ────────── (M) UserAccount
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 │ (as PIN)         │ (as CSR Rep)     │ (recipient)
                 │                  │                  │
                 ▼                  ▼                  ▼
            Request (1) ──── (M) Shortlist      Notification
                 │                  │
                 │                  │
            (M)  │  (1)        (M)  │  (1)
                 │                  │
                 ▼                  ▼
          VolunteerOffer ────► Request
                 │
                 │ (accepted offer creates)
                 ▼
              Match (1:1 with Request)
                 │
                 └──────► Notification (creates)

RequestCategory (1) ───── (M) Request
```

### Key Relationships

1. **UserProfile → UserAccount** (1:M)
   - One profile (role) has many users
   - 4 static profiles: PIN, CSR_REP, USER_ADMIN, PLATFORM_MANAGER

2. **UserAccount → Request** (1:M as PIN)
   - One PIN creates many requests

3. **UserAccount → Shortlist** (1:M as CSR Rep)
   - One CSR Rep can shortlist many requests

4. **Request → Shortlist** (1:M)
   - One request can be shortlisted by many CSR Reps

5. **UserAccount → VolunteerOffer** (1:M as CSR Rep)
   - One CSR Rep can make many offers

6. **Request → VolunteerOffer** (1:M)
   - One request can have many offers

7. **Request → Match** (1:1)
   - One request has exactly ONE match (requestId is unique)

8. **RequestCategory → Request** (1:M)
   - One category has many requests

9. **UserAccount → Notification** (1:M)
   - One user receives many notifications

---

## Detailed Entity Documentation

### 1. UserProfile

**Purpose**: Defines user roles in the system. Contains exactly 4 static records.

**Fields**:
- `id`: UUID primary key
- `name`: Unique role name (PIN, CSR_REP, USER_ADMIN, PLATFORM_MANAGER)
- `description`: Role description
- `permissions`: JSON permissions object
- `isActive`: Whether profile is active
- `createdAt`, `updatedAt`: Timestamps

**Instance Methods**: None

**Static Methods** (7 total):

| Method | Purpose | Usage |
|--------|---------|-------|
| `findAll()` | Get all profiles | Admin viewing all roles |
| `findById(id)` | Get profile by ID | Profile lookup |
| `findByName(name)` | Get profile by name | Role verification |
| `create(data)` | Create new profile | Initial seeding only |
| `update(id, data)` | Update profile | Admin changes role settings |
| `count()` | Count all profiles | Admin statistics |
| `search(query, isActive)` | Search profiles | Admin filtering profiles |

**Database Constraints**:
- `name` is UNIQUE
- Only 4 records should exist (seeded)

---

### 2. UserAccount

**Purpose**: Represents all users in the system using Single Table Inheritance.

**Fields**:
- Core: `id`, `email`, `password`, `name`, `phoneNumber`, `address`, `dateOfBirth`
- Status: `status` (ACTIVE, SUSPENDED, DELETED), `profileStatus`
- Role: `userProfileId` → UserProfile
- PIN-specific: `age`, `location`, `accessibilityNeeds`, `profilePhoto`
- CSR Rep-specific: `companyName`, `companyRegistrationNumber`, `industry`, `contactPerson`, `companyAddress`, `companyLogo`
- Platform Manager-specific: `department`

**Instance Methods** (2 total):

| Method | Purpose | Usage |
|--------|---------|-------|
| `getRole()` | Returns profile name | Used in 3 controllers for role checks |
| `toJSON()` | Serialize with date formatting | Used in 6 controllers for API responses |

**Static Methods** (21 total):

| Method | Purpose | Usage | User Story |
|--------|---------|-------|------------|
| `findAll(page, limit)` | Get paginated users | Admin lists users | #4 |
| `findById(id)` | Get user by ID | Profile viewing | #4 |
| `findByEmail(email)` | Get user by email | Login, uniqueness check | #1, #13, #24, #33 |
| `login(email, password)` | Authenticate user | Login endpoint | #1, #13, #24, #33 |
| `findByUserIdWithProfileName(userId, name)` | Get user with specific role | Role-specific queries | - |
| `findByProfileName(name, page, limit)` | Get all users of a role | Admin filtering by role | #7 |
| `findByStatus(status, page, limit)` | Get users by status | Admin filtering by status | #7 |
| `create(data)` | Create new user | Registration | #3 |
| `update(id, data)` | Update user | Profile editing | #5 |
| `delete(id)` | Soft delete user | Account removal | #6 (soft delete) |
| `count()` | Count all users | Statistics | - |
| `countByProfileName(name)` | Count users by role | Role statistics | - |
| `countByStatus(status)` | Count by status | Status statistics | - |
| `search(query, page, limit)` | Search users | Admin search | #7 |
| `suspend(id)` | Suspend user account | Admin action | #6 |
| `activate(id)` | Activate suspended account | Admin action | #6 |
| `updatePINProfile(userId, data)` | Update PIN-specific fields | PIN profile editing | - |
| `updateCSRRepProfile(userId, data)` | Update CSR-specific fields | CSR profile editing | - |
| `updatePlatformManagerProfile(userId, data)` | Update PM-specific fields | PM profile editing | - |
| `suspendProfile(id)` | Suspend via profile status | Alternative suspension | #11 |
| `activateProfile(id)` | Activate via profile status | Alternative activation | #11 |

**Why getRole() Exists**:
- Used by controllers to verify role-specific access
- Returns `userProfile?.name` (e.g., "PIN", "CSR_REP")
- Used in: login response, authorization checks, profile display

**Why toJSON() Exists**:
- Custom serialization for API responses
- Formats dates as ISO strings
- Excludes password field
- Used in 6 controllers when returning user data

---

### 3. RequestCategory

**Purpose**: Categorizes requests (e.g., "Food Assistance", "Medical Help").

**Fields**:
- `id`: UUID
- `name`: Unique category name
- `description`: Category description
- `iconUrl`: Optional icon
- `isActive`: Whether category is visible
- `createdAt`, `updatedAt`: Timestamps

**Instance Methods**: None

**Static Methods** (8 total):

| Method | Purpose | Usage | User Story |
|--------|---------|-------|------------|
| `findAll()` | Get all categories | Admin/PIN view | #36 |
| `findActive()` | Get only active | PIN creating request | #15 |
| `findById(id)` | Get category by ID | Category details | #36 |
| `create(data)` | Create category | Platform Manager | #35 |
| `update(id, data)` | Update category | Platform Manager | #37 |
| `delete(id)` | Delete category | Platform Manager | #38 |
| `search(query, includeInactive)` | Search categories | Platform Manager | #39 |
| `count()` | Count categories | Statistics | - |

**Database Constraints**:
- `name` is UNIQUE
- Cascade: Requests reference categories (ON DELETE RESTRICT recommended)

---

### 4. Request

**Purpose**: Represents a help request created by a PIN.

**Fields**:
- `id`, `pinId`, `categoryId`: Identifiers
- `title`, `description`: Request details
- `urgency`: LOW, MEDIUM, HIGH
- `dateNeeded`, `location`: When/where help needed
- `status`: ACTIVE, MATCHED, COMPLETED, CANCELLED
- `viewCount`: How many CSR Reps viewed
- `shortlistCount`: How many CSR Reps shortlisted
- `createdAt`, `updatedAt`: Timestamps

**Instance Methods** (1 total):

| Method | Purpose | Usage |
|--------|---------|-------|
| `toJSON()` | Serialize with date formatting | Used in 8 controllers for API responses |

**Static Methods** (15 total):

| Method | Purpose | Usage | User Story |
|--------|---------|-------|------------|
| `findById(id)` | Get request by ID | View request details | #16, #27 |
| `searchByPIN(pinId, ...)` | Search PIN's requests | PIN dashboard | #16, #19 |
| `findByStatus(status, page, limit)` | Get by status | Admin filtering | - |
| `findCompletedByPIN(pinId, query)` | Get completed requests | PIN history | #22, #23 |
| `create(data)` | Create request | PIN creates | #15 |
| `update(id, data)` | Update request | PIN edits | #17 |
| `delete(id)` | Delete request | PIN cancels | #18 |
| `count()` | Count all requests | Statistics | - |
| `countByStatus(status)` | Count by status | Status statistics | - |
| `search(query, ...)` | Search all requests | CSR Rep search | #26 |
| `incrementViewCountDB(id)` | Increment view count | CSR views request | #20 |
| `incrementShortlistCountDB(id)` | Increment shortlist count | CSR shortlists | #21 |
| `getViewCount(pinId, requestId)` | Get view count | PIN tracking | #20 |
| `getShortlistCount(pinId, requestId)` | Get shortlist count | PIN tracking | #21 |

**Why toJSON() Exists**:
- Formats `dateNeeded`, `createdAt`, `updatedAt` as ISO strings
- Ensures consistent date formatting in API responses
- Used whenever Request data is returned to frontend

**Status Lifecycle**:
1. **ACTIVE**: Request is open for offers
2. **MATCHED**: PIN accepted an offer, match created
3. **COMPLETED**: Help was provided successfully
4. **CANCELLED**: PIN cancelled the request

**View/Shortlist Tracking**:
- `incrementViewCountDB()` called when CSR Rep views request details
- `incrementShortlistCountDB()` called when CSR Rep shortlists
- Both are static database operations (not instance methods)

---

### 5. Shortlist

**Purpose**: Tracks which requests CSR Reps have saved for later.

**Fields**:
- `id`: UUID
- `csrRepId`: CSR Rep who shortlisted
- `requestId`: Request that was shortlisted
- `createdAt`: When shortlisted

**Instance Methods**: None

**Static Methods** (5 total):

| Method | Purpose | Usage | User Story |
|--------|---------|-------|------------|
| `findById(id)` | Get shortlist by ID | Internal lookup | - |
| `getShortlistedRequestIds(csrRepId)` | Get all shortlisted IDs | CSR Rep viewing shortlist | #30 |
| `create(data)` | Create shortlist | CSR Rep saves request | #28 |
| `deleteByCSRRepAndRequest(csrRepId, requestId)` | Remove shortlist | CSR Rep unsaves | #28 |
| `exists(csrRepId, requestId)` | Check if shortlisted | UI state (is saved?) | #28 |
| `search(csrRepId, query)` | Search shortlist | CSR Rep search | #29 |

**Database Constraints**:
- Composite unique key: `(csrRepId, requestId)` - CSR can only shortlist once
- Cascade: Auto-delete when Request is deleted

**Relationship to Request**:
- When shortlisted, `Request.incrementShortlistCountDB()` is called
- When removed, count should be decremented (TODO: verify)

---

### 6. VolunteerOffer

**Purpose**: Represents a CSR Rep's offer to help with a request.

**Fields**:
- `id`: UUID
- `csrRepId`: CSR Rep making offer
- `requestId`: Request being offered for
- `message`: Optional message to PIN
- `status`: PENDING, ACCEPTED, DECLINED
- `createdAt`, `updatedAt`: Timestamps

**Instance Methods**: None

**Static Methods** (4 total):

| Method | Purpose | Usage | User Story |
|--------|---------|-------|------------|
| `findById(id)` | Get offer by ID | Offer details | - |
| `exists(csrRepId, requestId)` | Check if offer exists | Prevent duplicate offers | - |
| `search(userId, role, status, page, limit)` | Search offers | PIN/CSR viewing offers | - |
| `create(data)` | Create offer | CSR Rep offers help | - |
| `update(id, data)` | Update offer status | PIN accepts/declines | - |

**Status Lifecycle**:
1. **PENDING**: Offer created, awaiting PIN decision
2. **ACCEPTED**: PIN accepted, Match created
3. **DECLINED**: PIN declined or auto-declined when another offer accepted

**Critical Logic**:
- When an offer is ACCEPTED:
  1. Match is created
  2. Request status → MATCHED
  3. All other offers for that request → DECLINED
- When a Match is cancelled:
  1. DECLINED offers should be reset to PENDING (implemented Nov 2025)

---

### 7. Match

**Purpose**: Represents a confirmed pairing between PIN and CSR Rep.

**Fields**:
- `id`: UUID
- `requestId`: UNIQUE - one request can only have one match
- `csrRepId`: CSR Rep matched
- `pinId`: PIN matched
- `status`: ACTIVE, COMPLETED, CANCELLED
- `matchedAt`: When match was created
- `completedAt`: When marked complete
- `cancellationReason`: If cancelled
- `updatedAt`: Last update

**Instance Methods**: None

**Static Methods** (5 total):

| Method | Purpose | Usage | User Story |
|--------|---------|-------|------------|
| `findById(id)` | Get match by ID | Match details | - |
| `searchByPIN(pinId, ...)` | Search PIN's matches | PIN dashboard | - |
| `search(userId, role, ...)` | Search matches | Both PIN/CSR | - |
| `create(data)` | Create match | PIN accepts offer | - |
| `update(id, data)` | Update match status | Complete/cancel | - |
| `count()` | Count matches | Statistics | - |

**Status Lifecycle**:
1. **ACTIVE**: Match is ongoing
2. **COMPLETED**: Help was successfully provided
3. **CANCELLED**: Match was cancelled by PIN or CSR

**Critical Constraints**:
- `requestId` is UNIQUE in database
- One request = one match maximum
- When created: Request.status → MATCHED
- When completed: Request.status → COMPLETED

---

### 8. Notification

**Purpose**: System notifications for users.

**Fields**:
- `id`: UUID
- `userId`: User receiving notification
- `type`: VOLUNTEER_OFFER, OFFER_ACCEPTED, OFFER_DECLINED, MATCH_CONFIRMED, MATCH_CANCELLED, REQUEST_UPDATED
- `message`: Notification text
- `isRead`: Read status
- `createdAt`: When created

**Instance Methods**: None

**Static Methods** (7 total):

| Method | Purpose | Usage | User Story |
|--------|---------|-------|------------|
| `findById(id)` | Get notification by ID | Internal lookup | - |
| `findByUserId(userId, page, limit)` | Get user's notifications | Notification list | - |
| `findUnreadByUserId(userId)` | Get unread only | Notification badge | - |
| `create(data)` | Create notification | System events | - |
| `markAsRead(id)` | Mark single as read | User clicks | - |
| `markAllAsRead(userId)` | Mark all as read | User action | - |
| `countUnread(userId)` | Count unread | Notification badge | - |

**Field Name Note**:
- Uses `userId` (NOT `userAccountId`)
- Corrected during Nov 2025 cleanup

**Cascade Behavior**:
- Auto-deleted when UserAccount is deleted
- Auto-deleted when Request is deleted (if linked)

---

## Method Reference

### Summary by Entity

| Entity | Instance Methods | Static Methods | Total |
|--------|-----------------|----------------|-------|
| UserProfile | 0 | 7 | 7 |
| UserAccount | 2 | 21 | 23 |
| RequestCategory | 0 | 8 | 8 |
| Request | 1 | 14 | 15 |
| Shortlist | 0 | 5 | 5 |
| VolunteerOffer | 0 | 4 | 4 |
| Match | 0 | 5 | 5 |
| Notification | 0 | 7 | 7 |
| **TOTAL** | **3** | **71** | **74** |

### Why So Few Instance Methods?

After Nov 2025 cleanup, only 3 instance methods remain:

1. **UserAccount.getRole()** - Used by 3 controllers for role verification
2. **UserAccount.toJSON()** - Used by 6 controllers for API responses
3. **Request.toJSON()** - Used by 8 controllers for API responses

All other operations are static methods because:
- Controllers call database operations directly
- No object-oriented behavior needed
- Static methods are clearer for database operations
- Instance methods for filtering/validation were replaced by database queries

---

## Data Flow Patterns

### Pattern 1: PIN Creates Request

1. **PIN logs in** → `UserAccount.login()` returns user + token
2. **PIN views categories** → `RequestCategory.findActive()`
3. **PIN creates request** → `Request.create()`
4. **Notification sent** → `Notification.create()` (to subscribed CSRs)

**Controllers involved**: `auth`, `getCategories`, `createRequest`, `notification`

---

### Pattern 2: CSR Rep Discovers Request

1. **CSR Rep searches** → `Request.search()`
2. **CSR Rep views details** → `Request.findById()` + `Request.incrementViewCountDB()`
3. **CSR Rep shortlists** → `Shortlist.create()` + `Request.incrementShortlistCountDB()`

**Controllers involved**: `searchRequests`, `viewRequest`, `saveRequest`

---

### Pattern 3: Offer → Match → Completion

1. **CSR Rep makes offer** → `VolunteerOffer.create()`
2. **PIN views offers** → `VolunteerOffer.search(userId='PIN', role='PIN')`
3. **PIN accepts offer** → 
   - `VolunteerOffer.update(id, status='ACCEPTED')`
   - `Match.create()`
   - `Request.update(id, status='MATCHED')`
   - Other offers → `VolunteerOffer.update(otherIds, status='DECLINED')`
   - `Notification.create()` (to CSR Rep and PIN)
4. **Help is provided** →
   - `Match.update(id, status='COMPLETED')`
   - `Request.update(requestId, status='COMPLETED')`
5. **PIN views history** → `Request.findCompletedByPIN()`

**Controllers involved**: `createOffer`, `getPINOffers`, `acceptOffer`, `completeMatch`, `viewCompletedRequests`

---

### Pattern 4: Match Cancellation

1. **User cancels match** → `Match.update(id, status='CANCELLED', reason)`
2. **Request reverted** → `Request.update(requestId, status='ACTIVE')`
3. **Declined offers reset** → `VolunteerOffer.update(ids, status='PENDING')` *(Critical fix Nov 2025)*
4. **Notifications sent** → `Notification.create()` (to both parties)

**Controllers involved**: `cancelMatch`

**Why reset declined offers?**
- When a match is cancelled, the request becomes ACTIVE again
- Previously DECLINED offers should get a second chance
- This was a logic bug fixed in Nov 2025 cleanup

---

## Verification Checklist

Use this checklist to verify diagram accuracy against codebase:

### Instance Methods Check
- [ ] UserAccount.getRole() exists and is used
- [ ] UserAccount.toJSON() exists and is used
- [ ] Request.toJSON() exists and is used
- [ ] No other instance methods exist

### Static Methods Check (by entity)
- [ ] UserProfile: 7 methods
- [ ] UserAccount: 21 methods
- [ ] RequestCategory: 8 methods
- [ ] Request: 14 methods
- [ ] Shortlist: 5 methods
- [ ] VolunteerOffer: 4 methods
- [ ] Match: 5 methods
- [ ] Notification: 7 methods

### Relationship Check
- [ ] UserProfile (1) → UserAccount (M)
- [ ] UserAccount (1) → Request (M) [as PIN]
- [ ] UserAccount (1) → Shortlist (M) [as CSR]
- [ ] UserAccount (1) → VolunteerOffer (M) [as CSR]
- [ ] UserAccount (1) → Notification (M)
- [ ] RequestCategory (1) → Request (M)
- [ ] Request (1) → Shortlist (M)
- [ ] Request (1) → VolunteerOffer (M)
- [ ] Request (1) → Match (1) [requestId unique]

### Field Name Check
- [ ] Notification uses `userId` (not `userAccountId`)
- [ ] All entities have `id`, `createdAt`
- [ ] UserAccount has all role-specific fields

### Enum Check
- [ ] UserStatus: ACTIVE, SUSPENDED, DELETED
- [ ] ProfileStatus: ACTIVE, SUSPENDED, DEACTIVATED
- [ ] RequestStatus: ACTIVE, MATCHED, COMPLETED, CANCELLED
- [ ] UrgencyLevel: LOW, MEDIUM, HIGH
- [ ] OfferStatus: PENDING, ACCEPTED, DECLINED
- [ ] MatchStatus: ACTIVE, COMPLETED, CANCELLED
- [ ] NotificationType: 6 types

### Method Usage Verification Commands

```bash
# Verify getRole() is used
grep -r "\.getRole()" server/src/controllers

# Verify toJSON() is used
grep -r "\.toJSON()" server/src/controllers

# Verify no other instance methods exist
grep -r "user\." server/src/controllers | grep -v "getRole\|toJSON"
grep -r "request\." server/src/controllers | grep -v "toJSON"

# Count static methods per entity
grep -c "static async" server/src/entities/UserAccount.entity.ts
grep -c "static async" server/src/entities/UserProfile.entity.ts
# ... repeat for each entity
```

---

## Common Pitfalls to Avoid

### ❌ DON'T: Add instance methods for simple property access
```typescript
// BAD - unnecessary wrapper
isActive(): boolean {
  return this.status === UserStatus.ACTIVE;
}

// GOOD - direct access
if (user.status === UserStatus.ACTIVE) { ... }
```

### ❌ DON'T: Add instance methods for filtering
```typescript
// BAD - filtering on instances
static async findActive() {
  const all = await prisma.userProfile.findMany();
  return all.filter(p => p.isActive);
}

// GOOD - database-level filtering
static async findActive() {
  return await prisma.userProfile.findMany({
    where: { isActive: true }
  });
}
```

### ✅ DO: Use instance methods for complex serialization
```typescript
// GOOD - custom serialization logic
toJSON() {
  return {
    ...this,
    dateNeeded: this.dateNeeded?.toISOString(),
    createdAt: this.createdAt.toISOString(),
    updatedAt: this.updatedAt.toISOString()
  };
}
```

### ✅ DO: Use static methods for all database operations
```typescript
// GOOD - database operations are static
static async create(data: CreateData) {
  const result = await prisma.entity.create({ data });
  return new Entity(result);
}
```

---

## Changelog

### November 5, 2025
- Removed `UserAccount.isActive()` - only used internally once, inlined
- Removed notes from all diagrams for cleaner documentation
- **Final count**: 3 instance methods, 71 static methods across 8 entities

### November 4, 2025
- Removed 5 unused `UserAccount` methods: `isPIN()`, `isCSRRep()`, `isPlatformManager()`, `isAdmin()`, `getProfileName()`
- Removed 8 additional unused static methods across entities
- Fixed critical logic bug: Reset DECLINED offers when match cancelled

### November 2, 2025
- Major cleanup: Removed 35+ unused instance methods
- Removed entire `/dto` folder (unused)
- Fixed `Notification.userId` field name inconsistency
- Updated all diagrams to match cleaned codebase

---

## Notes

This documentation is the **authoritative reference** for the system architecture. 

**When making changes:**
1. Update the code first
2. Update this documentation
3. Update the diagrams
4. Run verification checklist
5. Test the system

**This prevents** issues like the `isActive()` method being in diagrams but barely used in code.

---

**Document Version:** 1.0  
**Last Verified:** November 5, 2025  
**Verified By:** AI Assistant + User Review

