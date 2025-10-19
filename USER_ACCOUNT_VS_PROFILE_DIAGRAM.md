# User Account vs User Profile - Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER IN SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  🔐 USER ACCOUNT (Authentication Layer)                │   │
│  │  Table: users                                          │   │
│  │  Status Field: User.status                            │   │
│  │                                                         │   │
│  │  • Email: user@example.com                            │   │
│  │  • Password: (hashed)                                 │   │
│  │  • Status: ACTIVE / SUSPENDED / DEACTIVATED          │   │
│  │                                                         │   │
│  │  Controls: CAN USER LOGIN?                           │   │
│  │  • ACTIVE ✓ → Can login                             │   │
│  │  • SUSPENDED ✗ → Cannot login                       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│                           ↓                                     │
│                     (IF LOGIN SUCCESS)                          │
│                           ↓                                     │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  👤 USER PROFILE (Authorization Layer)                │   │
│  │  Tables: pins / csr_reps / platform_managers         │   │
│  │  Status Field: [profile].status                      │   │
│  │                                                         │   │
│  │  • Role-specific data (name, company, etc.)          │   │
│  │  • Status: ACTIVE / SUSPENDED / DEACTIVATED          │   │
│  │                                                         │   │
│  │  Controls: CAN USER PERFORM ROLE TASKS?             │   │
│  │  • ACTIVE ✓ → Can create requests, save shortlist   │   │
│  │  • SUSPENDED ✗ → Can view only, no actions          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Status Combinations & Effects

```
┌─────────────────┬─────────────────┬──────────────┬─────────────────────┐
│ Account Status  │ Profile Status  │  Can Login?  │  Can Perform Tasks? │
├─────────────────┼─────────────────┼──────────────┼─────────────────────┤
│ ACTIVE          │ ACTIVE          │  ✅ Yes      │  ✅ Yes             │
│ ACTIVE          │ SUSPENDED       │  ✅ Yes      │  ❌ No              │
│ SUSPENDED       │ ACTIVE          │  ❌ No       │  N/A (Can't login)  │
│ SUSPENDED       │ SUSPENDED       │  ❌ No       │  N/A (Can't login)  │
└─────────────────┴─────────────────┴──────────────┴─────────────────────┘
```

---

## Admin UI - UserDetailsModal Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Details Modal                           │
│                                                                  │
│  📧 user@example.com                    [X Close]                │
│  🏷️  PIN                                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║ 🔐 USER ACCOUNT (Authentication)          [ACTIVE] ✓      ║  │
│  ╠═══════════════════════════════════════════════════════════╣  │
│  ║ ✓ User can login - Account is active                      ║  │
│  ║                                                            ║  │
│  ║ 📧 Email: user@example.com                                ║  │
│  ║ 📅 Created: January 1, 2024                               ║  │
│  ║                                                            ║  │
│  ║ [🔒 Suspend Account (Block Login)]                        ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│                                                                  │
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║ 👤 USER PROFILE (Role & Permissions)      [ACTIVE] ✓      ║  │
│  ╠═══════════════════════════════════════════════════════════╣  │
│  ║ ✓ User can perform all role-specific tasks                ║  │
│  ║                                                            ║  │
│  ║ [❌ Suspend Profile (Disable Tasks)]                      ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│                                                                  │
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║ 📋 PIN Profile Details                                     ║  │
│  ║ Name: John Doe                                            ║  │
│  ║ Age: 65                                                   ║  │
│  ║ Location: Singapore                                       ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│                                                                  │
│                                        [Close]                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Login Flow

### Scenario 1: Both Active (Normal User)
```
┌──────────┐     ┌──────────────┐     ┌────────────────┐     ┌─────────┐
│  Login   │────▶│ Check        │────▶│ Check Profile  │────▶│ Success │
│  Page    │     │ Account      │     │ Status (for    │     │ Full    │
│          │     │ Status       │     │ role actions)  │     │ Access  │
└──────────┘     └──────────────┘     └────────────────┘     └─────────┘
                        │                      │
                        ✓                      ✓
                    ACTIVE                 ACTIVE
```

### Scenario 2: Account Suspended
```
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│  Login   │────▶│ Check        │────▶│  ❌ ERROR   │
│  Page    │     │ Account      │     │ "Account    │
│          │     │ Status       │     │  suspended" │
└──────────┘     └──────────────┘     └─────────────┘
                        │
                        ✗
                   SUSPENDED
                   (Stop here)
```

### Scenario 3: Profile Suspended (Account Active)
```
┌──────────┐     ┌──────────────┐     ┌────────────────┐
│  Login   │────▶│ Check        │────▶│ ✓ Login        │
│  Page    │     │ Account      │     │   Success      │
│          │     │ Status       │     │                │
└──────────┘     └──────────────┘     └────────────────┘
                        │                      │
                        ✓                      │
                    ACTIVE                     ▼
                                    ┌─────────────────────┐
                                    │ Can view dashboard  │
                                    │ Cannot create       │
                                    │ requests/actions    │
                                    └─────────────────────┘
                                               │
                                    ┌──────────▼─────────┐
                                    │ Action Attempt     │
                                    │ (Create Request)   │
                                    └──────────┬─────────┘
                                               │
                                    ┌──────────▼─────────┐
                                    │ Check Profile      │
                                    │ Status             │
                                    └──────────┬─────────┘
                                               │
                                               ✗
                                          SUSPENDED
                                               │
                                    ┌──────────▼─────────┐
                                    │  ❌ ERROR          │
                                    │ "Profile suspended │
                                    │  - Cannot perform  │
                                    │  role tasks"       │
                                    └────────────────────┘
```

---

## Middleware Chain

```
                Request to Role-Specific Endpoint
                        (e.g., POST /requests)
                                │
                                ▼
                ┌───────────────────────────────┐
                │  authenticate() Middleware    │
                │  Checks: User.status          │
                └───────────────┬───────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
            ✓ ACTIVE                  ✗ SUSPENDED
                    │                       │
                    │                       ▼
                    │           ┌─────────────────────┐
                    │           │ 403 Forbidden       │
                    │           │ "Account suspended" │
                    │           └─────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────────┐
    │  requireActiveProfile() Middleware    │
    │  Checks: [Profile].status             │
    └───────────────┬───────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
    ✓ ACTIVE              ✗ SUSPENDED
        │                       │
        │                       ▼
        │           ┌─────────────────────┐
        │           │ 403 Forbidden       │
        │           │ "Profile suspended" │
        │           └─────────────────────┘
        │
        ▼
┌───────────────────────┐
│  authorize()          │
│  Checks: User Type    │
└───────────┬───────────┘
            │
            ▼
    ┌───────────────┐
    │  Controller   │
    │  (Handle      │
    │   Request)    │
    └───────────────┘
```

---

## Database Schema

```sql
-- USER ACCOUNT TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password VARCHAR,
  userType ENUM('PIN', 'CSR_REP', 'ADMIN', 'PLATFORM_MANAGER'),
  status ENUM('ACTIVE', 'SUSPENDED', 'DEACTIVATED'),  ← Account Status
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- USER PROFILE TABLES (Role-Specific)

CREATE TABLE pins (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  name VARCHAR,
  age INT,
  location VARCHAR,
  phoneNumber VARCHAR,
  status ENUM('ACTIVE', 'SUSPENDED', 'DEACTIVATED')  ← Profile Status
);

CREATE TABLE csr_reps (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  companyName VARCHAR,
  companyRegistrationNumber VARCHAR,
  contactPerson VARCHAR,
  phoneNumber VARCHAR,
  status ENUM('ACTIVE', 'SUSPENDED', 'DEACTIVATED')  ← Profile Status
);

CREATE TABLE platform_managers (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  fullName VARCHAR,
  department VARCHAR,
  phone VARCHAR,
  status ENUM('ACTIVE', 'SUSPENDED', 'DEACTIVATED')  ← Profile Status
);
```

---

## API Endpoints

```
Account Management (affects login):
  PUT /admin/users/:id/suspend
    → Sets User.status = SUSPENDED
    → User cannot login

  PUT /admin/users/:id/activate  
    → Sets User.status = ACTIVE
    → User can login

Profile Management (affects permissions):
  PUT /admin/profiles/:id/suspend
    → Sets [Profile].status = SUSPENDED
    → User can login but cannot perform role tasks

  PUT /admin/profiles/:id/activate
    → Sets [Profile].status = ACTIVE
    → User can perform role tasks
```

---

## Color Coding in UI

```
🔵 Blue = User Account Section
  - Authentication layer
  - Controls login ability
  - Email, account creation date

🟣 Purple = User Profile Section
  - Authorization layer
  - Controls role permissions
  - Role-specific data
```

---

## Quick Reference

| Need to...                          | Suspend...     | Effect...                      |
|-------------------------------------|----------------|--------------------------------|
| Block user completely               | Account        | Cannot login                   |
| Restrict permissions temporarily    | Profile        | Can login, no role actions     |
| Under security review              | Account        | Complete lockout               |
| Under compliance review            | Profile        | Limited access                 |
| User reported as compromised       | Account        | Immediate protection           |
| Pending verification               | Profile        | View-only access               |

---

## Implementation Files

### Backend
- `server/prisma/schema.prisma` - Added ProfileStatus enum
- `server/src/entities/*.entity.ts` - Status management
- `server/src/middleware/auth.ts` - Status checking
- `server/src/controllers/userAdmin/*.controller.ts` - Suspend/Activate

### Frontend
- `client/src/components/UserDetailsModal.tsx` - Two-section UI
- `client/src/types/index.ts` - ProfileStatus type

---

**This visual guide helps understand the complete separation of Account (Authentication) vs Profile (Authorization) in the CSR Matching System.**

