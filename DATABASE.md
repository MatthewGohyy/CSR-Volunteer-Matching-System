# Database Documentation

## Overview

This project uses **PostgreSQL** as the database with **Prisma ORM** for type-safe database access. The database runs in a Docker container for easy local development.

---

## Architecture

```
┌─────────────────────────────────────────┐
│         Docker Containers               │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  PostgreSQL  │  │   pgAdmin    │    │
│  │   Port 5432  │  │   Port 5050  │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│          Prisma ORM                     │
│  - Type-safe queries                    │
│  - Auto-generated client                │
│  - Migration management                 │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│      Express.js Application             │
│  - Controllers & Routes                 │
│  - Business logic                       │
│  - Authentication                       │
└─────────────────────────────────────────┘
```

---

## Database Schema

### 👤 Users & Authentication

#### UserAccount (Main Authentication Table)
**Purpose:** Base user account model for authentication and personal information

**Fields:**
- `id` - UUID (Primary Key)
- `email` - String (Unique)
- `password` - String (Bcrypt hashed)
- `name` - String
- `phoneNumber` - String (Optional)
- `address` - String (Optional)
- `dateOfBirth` - DateTime (Optional)
- `status` - Enum: `ACTIVE`, `SUSPENDED`, `DELETED`
- `userProfileId` - UUID (Foreign Key → UserProfile)
- `createdAt`, `updatedAt` - Timestamps

**Relations:**
- Many-to-one with UserProfile (role definition)
- One-to-one with PIN, CSRRep, or PlatformManager profile
- One-to-many with Notifications

#### UserProfile (Role Definition Table)
**Purpose:** Defines user roles and permissions (exactly 4 static records)

**Fields:**
- `id` - UUID (Primary Key)
- `role` - Enum (Unique): `PIN`, `CSR_REP`, `USER_ADMIN`, `PLATFORM_MANAGER`
- `name` - String (e.g., "Person in Need", "CSR Representative")
- `description` - String (Optional)
- `permissions` - JSON (Optional - for future RBAC)
- `isActive` - Boolean (Default: true)
- `createdAt`, `updatedAt` - Timestamps

**Relations:**
- One-to-many with UserAccount

**Note:** This table contains exactly 4 records (one for each role). New users reference one of these records via `userProfileId`.

---

### 👥 User Profiles

#### PIN (Person In Need)
**Purpose:** Profile for individuals seeking help

**Fields:**
- `id` - UUID (Primary Key)
- `userAccountId` - UUID (Foreign Key → UserAccount, Unique)
- `name` - String
- `age` - Integer (Optional)
- `location` - String (Optional)
- `phoneNumber` - String (Optional)
- `accessibilityNeeds` - String (Optional)
- `profilePhoto` - String (Optional)
- `status` - Enum: `ACTIVE`, `SUSPENDED`, `DEACTIVATED`

**Relations:**
- One-to-many with Request
- One-to-many with Match

---

#### CSRRep (CSR Representative)
**Purpose:** Profile for company representatives offering help

**Fields:**
- `id` - UUID (Primary Key)
- `userAccountId` - UUID (Foreign Key → UserAccount, Unique)
- `companyName` - String
- `companyRegistrationNumber` - String (Unique)
- `industry` - String (Optional)
- `contactPerson` - String
- `phoneNumber` - String
- `companyAddress` - String (Optional)
- `companyLogo` - String (Optional)
- `status` - Enum: `ACTIVE`, `SUSPENDED`, `DEACTIVATED`

**Relations:**
- One-to-many with Shortlist
- One-to-many with VolunteerOffer
- One-to-many with Match

---

#### PlatformManager
**Purpose:** Profile for platform administrators

**Fields:**
- `id` - UUID (Primary Key)
- `userAccountId` - UUID (Foreign Key → UserAccount, Unique)
- `fullName` - String
- `department` - String (Optional)
- `phone` - String (Optional)
- `status` - Enum: `ACTIVE`, `SUSPENDED`, `DEACTIVATED`

**Relations:**
- None (manages categories via API)

---

### 📋 Service Management

#### ServiceCategory
**Purpose:** Predefined categories for service requests

**Fields:**
- `id` - UUID (Primary Key)
- `name` - String (Unique)
- `description` - String (Optional)
- `iconUrl` - String (Optional)
- `isActive` - Boolean (Default: true)
- `createdAt`, `updatedAt` - Timestamps

**Relations:**
- One-to-many with Request

**Examples:** Medical, Transportation, Companionship, Home Care, Meal Delivery, etc.

---

#### Request
**Purpose:** Help requests posted by PINs

**Fields:**
- `id` - UUID (Primary Key)
- `pinId` - UUID (Foreign Key → PIN)
- `categoryId` - UUID (Foreign Key → ServiceCategory)
- `title` - String
- `description` - String
- `urgency` - Enum: `LOW`, `MEDIUM`, `HIGH`
- `dateNeeded` - DateTime (Optional)
- `location` - String (Optional)
- `status` - Enum: `ACTIVE`, `MATCHED`, `COMPLETED`, `CANCELLED`
- `viewCount` - Integer (Default: 0)
- `shortlistCount` - Integer (Default: 0)
- `createdAt`, `updatedAt` - Timestamps

**Relations:**
- Many-to-one with PIN
- Many-to-one with ServiceCategory
- One-to-many with Shortlist
- One-to-many with VolunteerOffer
- One-to-one with Match (when matched)

---

### 🤝 Matching System

#### Shortlist
**Purpose:** CSR reps save requests they're interested in

**Fields:**
- `id` - UUID (Primary Key)
- `csrRepId` - UUID (Foreign Key → CSRRep)
- `requestId` - UUID (Foreign Key → Request)
- `createdAt` - Timestamp

**Constraints:**
- Unique combination of (csrRepId, requestId)

**Relations:**
- Many-to-one with CSRRep
- Many-to-one with Request

---

#### VolunteerOffer
**Purpose:** Formal offers from CSR reps to help with requests

**Fields:**
- `id` - UUID (Primary Key)
- `csrRepId` - UUID (Foreign Key → CSRRep)
- `requestId` - UUID (Foreign Key → Request)
- `message` - String (Optional)
- `status` - Enum: `PENDING`, `ACCEPTED`, `DECLINED`
- `createdAt`, `updatedAt` - Timestamps

**Relations:**
- Many-to-one with CSRRep
- Many-to-one with Request

---

#### Match
**Purpose:** Confirmed matches between PINs and CSR reps

**Fields:**
- `id` - UUID (Primary Key)
- `requestId` - UUID (Foreign Key → Request, Unique)
- `csrRepId` - UUID (Foreign Key → CSRRep)
- `pinId` - UUID (Foreign Key → PIN)
- `status` - Enum: `ACTIVE`, `COMPLETED`, `CANCELLED`
- `matchedAt` - Timestamp (Default: now)
- `completedAt` - Timestamp (Optional)
- `cancellationReason` - String (Optional)
- `updatedAt` - Timestamp

**Constraints:**
- One request can only have one match (unique requestId)

**Relations:**
- One-to-one with Request
- Many-to-one with CSRRep
- Many-to-one with PIN

---

### 🔔 Notifications

#### Notification
**Purpose:** System notifications for users

**Fields:**
- `id` - UUID (Primary Key)
- `userId` - UUID (Foreign Key → User)
- `type` - Enum: `VOLUNTEER_OFFER`, `OFFER_ACCEPTED`, `OFFER_DECLINED`, `MATCH_CONFIRMED`, `MATCH_CANCELLED`, `REQUEST_UPDATED`
- `message` - String
- `isRead` - Boolean (Default: false)
- `createdAt` - Timestamp

**Relations:**
- Many-to-one with User

---

## Entity Relationships

```
UserProfile (1) ──── (0..*) UserAccount
UserAccount (1) ──── (0..1) PIN
UserAccount (1) ──── (0..1) CSRRep
UserAccount (1) ──── (0..1) PlatformManager
UserAccount (1) ──── (0..*) Notification

PIN (1) ──── (0..*) Request
PIN (1) ──── (0..*) Match

CSRRep (1) ──── (0..*) Shortlist
CSRRep (1) ──── (0..*) VolunteerOffer
CSRRep (1) ──── (0..*) Match

ServiceCategory (1) ──── (0..*) Request

Request (1) ──── (0..*) Shortlist
Request (1) ──── (0..*) VolunteerOffer
Request (1) ──── (0..1) Match
```

---

## Enums

### UserProfileRole (New!)
- `PIN` - Person In Need
- `CSR_REP` - CSR Representative
- `USER_ADMIN` - User Administrator
- `PLATFORM_MANAGER` - Platform Manager

**Note:** Only 4 records exist in UserProfile table with these roles.

### UserStatus
- `ACTIVE` - Normal operation
- `SUSPENDED` - Temporarily restricted
- `DELETED` - Permanently deleted (changed from DEACTIVATED)

### ProfileStatus
- `ACTIVE` - Normal operation
- `SUSPENDED` - Temporarily restricted
- `DELETED` - Permanently deleted

### RequestStatus
- `ACTIVE` - Open for offers
- `MATCHED` - Matched with volunteer
- `COMPLETED` - Help provided successfully
- `CANCELLED` - Cancelled by PIN

### UrgencyLevel
- `LOW` - Can wait, flexible timing
- `MEDIUM` - Within a week
- `HIGH` - Urgent, ASAP

### OfferStatus
- `PENDING` - Awaiting PIN response
- `ACCEPTED` - PIN accepted the offer
- `DECLINED` - PIN declined the offer

### MatchStatus
- `ACTIVE` - Ongoing match
- `COMPLETED` - Successfully completed
- `CANCELLED` - Cancelled by either party

### NotificationType
- `VOLUNTEER_OFFER` - New offer received
- `OFFER_ACCEPTED` - Offer was accepted
- `OFFER_DECLINED` - Offer was declined
- `MATCH_CONFIRMED` - Match created
- `MATCH_CANCELLED` - Match cancelled
- `REQUEST_UPDATED` - Request details changed

---

## Database Operations

### Setup
```bash
# Start PostgreSQL in Docker
docker-compose up -d

# Generate Prisma client
cd server
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (if seed file exists)
npx prisma db seed
```

### Maintenance
```bash
# View database in Prisma Studio
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Backup
```bash
# Backup database
docker exec postgres_db pg_dump -U csr_user csr_db > backup.sql

# Restore database
docker exec -i postgres_db psql -U csr_user csr_db < backup.sql
```

---

## Connection Details

### Application Connection
```env
DATABASE_URL="postgresql://csr_user:csr_password@localhost:5432/csr_db"
```

### pgAdmin Access
- URL: `http://localhost:5050`
- Email: `admin@csr.com`
- Password: `admin123`

### Server Connection in pgAdmin
- Host: `postgres_db` (or `localhost` from host machine)
- Port: `5432`
- Database: `csr_db`
- Username: `csr_user`
- Password: `csr_password`

---

---

## 🔄 Schema Refactoring (October 2025)

### Major Changes:
1. **User → UserAccount**: Renamed for clarity
2. **UserProfile Table Added**: Separates role definition from user accounts
3. **UserType → UserProfileRole**: Changed enum name
4. **Relationship Change**: UserAccount now references UserProfile (many-to-one)
5. **Status Enum Update**: `DEACTIVATED` → `DELETED`

### Benefits:
- **Clear Separation**: User identity vs. role/authorization
- **Scalability**: Easy to add new roles
- **Maintainability**: Role permissions in one place
- **Data Integrity**: Foreign key ensures valid roles

---

**Last Updated:** October 28, 2025
