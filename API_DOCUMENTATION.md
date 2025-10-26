# API Documentation

**Base URL:** `http://localhost:4000/api`

**Authentication:** Most endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 📑 Table of Contents

1. [Authentication](#authentication)
2. [Admin Endpoints](#admin-endpoints)
3. [PIN (Volunteer) Endpoints](#pin-endpoints)
4. [CSR Rep (Organization) Endpoints](#csr-rep-endpoints)
5. [Platform Manager Endpoints](#platform-manager-endpoints)
6. [Opportunities/Requests](#opportunities)
7. [Matches](#matches)
8. [Enums & Status Codes](#enums)

---

## 🔐 Authentication

### Register PIN
```http
POST /api/auth/register/pin
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe",
  "age": 65,
  "location": "Singapore",
  "phoneNumber": "+65 9123 4567",
  "accessibilityNeeds": "Wheelchair accessible"
}
```

### Register CSR Representative
```http
POST /api/auth/register/csr-rep
```
**Body:**
```json
{
  "email": "rep@company.com",
  "password": "password123",
  "companyName": "TechCorp Pte Ltd",
  "companyRegistrationNumber": "202012345A",
  "industry": "Technology",
  "contactPerson": "Jane Smith",
  "phoneNumber": "+65 6123 4567",
  "companyAddress": "123 Business St, Singapore"
}
```

### Login (All User Types)
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "userType": "PIN",
    "profile": { ... }
  },
  "token": "jwt_token"
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Update Password
```http
PUT /api/auth/password
Authorization: Bearer <token>
```
**Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

---

## 🧑‍💼 Admin Endpoints

**Base:** `/api/admin`  
**Auth:** Admin only

### User Account Management

#### List Users
```http
GET /api/admin/users?page=1&limit=10
```

#### Search Users
```http
GET /api/admin/users/search?q=john
```

#### Get User by ID
```http
GET /api/admin/users/:id
```

#### Create User Account
```http
POST /api/admin/users
```

#### Update User Account
```http
PUT /api/admin/users/:id
```

#### Update User Status
```http
PUT /api/admin/users/:id/status
```
**Body:**
```json
{
  "status": "ACTIVE" | "SUSPENDED" | "DEACTIVATED"
}
```

#### Suspend User
```http
PUT /api/admin/users/:id/suspend
```

#### Activate User
```http
PUT /api/admin/users/:id/activate
```

#### Delete User
```http
DELETE /api/admin/users/:id
```

### User Profile Management

#### List Profiles
```http
GET /api/admin/profiles?page=1&limit=10
```

#### Search Profiles
```http
GET /api/admin/profiles/search?q=john
```

#### Get Profile by ID
```http
GET /api/admin/profiles/:id
```

#### Create User Profile
```http
POST /api/admin/profiles
```

#### Update User Profile
```http
PUT /api/admin/profiles/:id
```

#### Suspend Profile
```http
PUT /api/admin/profiles/:id/suspend
```

#### Activate Profile
```http
PUT /api/admin/profiles/:id/activate
```

### System Stats
```http
GET /api/admin/stats
```

---

## 🙋 PIN Endpoints

**Base:** `/api/volunteers`  
**Auth:** PIN only

### Profile
```http
GET /api/volunteers/profile
PUT /api/volunteers/profile
```

### Matches
```http
GET /api/volunteers/matches
```

### Notifications
```http
GET /api/volunteers/notifications
PUT /api/volunteers/notifications/:notificationId/read
PUT /api/volunteers/notifications/read-all
```

### Request History
```http
GET /api/volunteers/requests/history?page=1&limit=10
GET /api/volunteers/requests/history/search?q=food
```

---

## 🏢 CSR Rep Endpoints

**Base:** `/api/organizations`  
**Auth:** CSR Rep only

### Shortlist Management
```http
POST /api/organizations/shortlist
```
**Body:**
```json
{
  "requestId": "uuid"
}
```

```http
GET /api/organizations/shortlists?page=1&limit=10
GET /api/organizations/shortlist/search?q=food
DELETE /api/organizations/shortlist/:requestId
```

### Volunteer Offers
```http
POST /api/organizations/offers
```
**Body:**
```json
{
  "requestId": "uuid",
  "message": "We would like to help"
}
```

```http
GET /api/organizations/offers
```

### Matches
```http
GET /api/organizations/matches
```

### Request History
```http
GET /api/organizations/requests/history?page=1&limit=10
GET /api/organizations/requests/history/search?q=food
```

### Profile
```http
PUT /api/organizations/profile
```

---

## 🧭 Platform Manager Endpoints

**Base:** `/api/platform-manager`  
**Auth:** Platform Manager only

### Category Management
```http
GET /api/platform-manager/categories?page=1&limit=10
GET /api/platform-manager/categories/:id
GET /api/platform-manager/categories/search?q=medical
POST /api/platform-manager/categories
PUT /api/platform-manager/categories/:id
DELETE /api/platform-manager/categories/:id
```

**Create/Update Body:**
```json
{
  "name": "Medical",
  "description": "Healthcare support",
  "iconUrl": "https://...",
  "isActive": true
}
```

### Stats
```http
GET /api/platform-manager/stats
```

### Profile
```http
GET /api/platform-manager/profile
PUT /api/platform-manager/profile
```

---

## 📋 Opportunities

**Base:** `/api/opportunities`

### Public
```http
GET /api/opportunities/categories
```

### CSR Rep - Browse Requests
```http
GET /api/opportunities?status=ACTIVE&urgency=HIGH&page=1&limit=10
GET /api/opportunities/:id
GET /api/opportunities/search?q=food
```

### PIN - Manage Own Requests
```http
POST /api/opportunities
PUT /api/opportunities/:id
DELETE /api/opportunities/:id
GET /api/opportunities/my/requests?page=1&limit=10
GET /api/opportunities/my/search?q=food
GET /api/opportunities/my/:id/views
GET /api/opportunities/my/:id/shortlists
```

**Create Request Body:**
```json
{
  "categoryId": "uuid",
  "title": "Need grocery help",
  "description": "Weekly shopping assistance",
  "urgency": "MEDIUM",
  "dateNeeded": "2024-12-25",
  "location": "Jurong West"
}
```

---

## 🤝 Matches

**Base:** `/api/matches`  
**Auth:** Required

### PIN - Manage Offers
```http
GET /api/matches/offers
POST /api/matches/offers/:offerId/accept
POST /api/matches/offers/:offerId/decline
```

### Both PIN & CSR Rep
```http
PUT /api/matches/:matchId/complete
PUT /api/matches/:matchId/cancel
```
**Cancel Body:**
```json
{
  "reason": "Scheduling conflict"
}
```

---

## 📊 Enums

### UserType
- `PIN` - Person In Need
- `CSR_REP` - CSR Representative
- `ADMIN` - Administrator
- `PLATFORM_MANAGER` - Platform Manager

### UserStatus / ProfileStatus
- `ACTIVE`
- `SUSPENDED`
- `DEACTIVATED`

### RequestStatus
- `ACTIVE` - Available for offers
- `MATCHED` - Matched with volunteer
- `COMPLETED` - Help provided
- `CANCELLED` - Cancelled

### UrgencyLevel
- `LOW`
- `MEDIUM`
- `HIGH`

### OfferStatus
- `PENDING`
- `ACCEPTED`
- `DECLINED`

### MatchStatus
- `ACTIVE`
- `COMPLETED`
- `CANCELLED`

### NotificationType
- `VOLUNTEER_OFFER`
- `OFFER_ACCEPTED`
- `OFFER_DECLINED`
- `MATCH_CONFIRMED`
- `MATCH_CANCELLED`
- `REQUEST_UPDATED`

---

## 🔢 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request - Invalid input |
| 401  | Unauthorized - Missing/invalid token |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found |
| 409  | Conflict - Duplicate entry |
| 500  | Internal Server Error |

---

**Last Updated:** 2025-10-21
