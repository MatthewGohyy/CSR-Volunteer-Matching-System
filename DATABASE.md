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

#### User (Main Authentication Table)
**Purpose:** Base user model for authentication across all user types

**Fields:**
- `id` - UUID (Primary Key)
- `email` - String (Unique)
- `password` - String (Bcrypt hashed)
- `userType` - Enum: `PIN`, `CSR_REP`, `ADMIN`, `PLATFORM_MANAGER`
- `status` - Enum: `ACTIVE`, `SUSPENDED`, `DEACTIVATED`
- `createdAt`, `updatedAt` - Timestamps

**Relations:**
- One-to-one with PIN, CSRRep, or PlatformManager profile
- One-to-many with Notifications

---

### 👥 User Profiles

#### PIN (Person In Need)
**Purpose:** Profile for individuals seeking help

**Fields:**
- `id` - UUID (Primary Key)
- `userId` - UUID (Foreign Key → User, Unique)
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
- `userId` - UUID (Foreign Key → User, Unique)
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
- `userId` - UUID (Foreign Key → User, Unique)
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
User (1) ──── (0..1) PIN
User (1) ──── (0..1) CSRRep
User (1) ──── (0..1) PlatformManager
User (1) ──── (0..*) Notification

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

### UserType
- `PIN` - Person In Need
- `CSR_REP` - CSR Representative
- `ADMIN` - Administrator
- `PLATFORM_MANAGER` - Platform Manager

### UserStatus & ProfileStatus
- `ACTIVE` - Normal operation
- `SUSPENDED` - Temporarily restricted
- `DEACTIVATED` - Permanently disabled

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

**Last Updated:** October 21, 2025
