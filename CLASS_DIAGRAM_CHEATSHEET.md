# Class Diagram Cheat Sheet

Quick reference for the CSR Volunteer Matching System class structure.

## 🏗️ BCE Architecture Layers

```
┌─────────────────────────────────────────────────┐
│  BOUNDARY (Frontend - React Components)         │
│  LoginPage, AdminDashboard, RequestForm, etc.   │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  CONTROLLER (Backend - Express Routes)          │
│  AuthController, AdminController, etc.          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  SERVICE (Business Logic)                       │
│  UserService, MatchingService, etc.             │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  ENTITY (Database Models - Prisma)              │
│  User, PIN, CSRRep, Request, Match, etc.        │
└─────────────────────────────────────────────────┘
```

---

## 📦 Core Entities (Database Models)

### 👤 User Entities
```
User (Base)
├── id: string (UUID)
├── email: string (unique)
├── password: string (hashed)
├── userType: UserType (enum)
├── status: UserStatus (enum)
└── Relations:
    ├── PIN (1:1)
    ├── CSRRep (1:1)
    ├── PlatformManager (1:1)
    └── Notification[] (1:many)
```

```
PIN (Person-In-Need Profile)
├── id: string
├── userId: string (FK → User)
├── name: string
├── age: int
├── location: string
└── Relations:
    ├── User (1:1)
    ├── Request[] (1:many)
    └── Match[] (1:many)
```

```
CSRRep (CSR Representative Profile)
├── id: string
├── userId: string (FK → User)
├── companyName: string
├── companyRegistrationNumber: string (unique)
├── contactPerson: string
├── phoneNumber: string
└── Relations:
    ├── User (1:1)
    ├── Shortlist[] (1:many)
    ├── VolunteerOffer[] (1:many)
    └── Match[] (1:many)
```

### 📋 Request Entities
```
Request
├── id: string
├── pinId: string (FK → PIN)
├── categoryId: string (FK → ServiceCategory)
├── title: string
├── description: string
├── urgency: UrgencyLevel (enum)
├── status: RequestStatus (enum)
├── viewCount: int
├── shortlistCount: int
└── Relations:
    ├── PIN (many:1)
    ├── ServiceCategory (many:1)
    ├── Shortlist[] (1:many)
    ├── VolunteerOffer[] (1:many)
    └── Match (1:1)
```

```
ServiceCategory
├── id: string
├── name: string (unique)
├── description: string
├── isActive: boolean
└── Relations:
    └── Request[] (1:many)
```

### 🤝 Matching Entities
```
Shortlist
├── id: string
├── csrRepId: string (FK → CSRRep)
├── requestId: string (FK → Request)
└── Relations:
    ├── CSRRep (many:1)
    └── Request (many:1)
```

```
VolunteerOffer
├── id: string
├── csrRepId: string (FK → CSRRep)
├── requestId: string (FK → Request)
├── message: string
├── status: OfferStatus (enum)
└── Relations:
    ├── CSRRep (many:1)
    └── Request (many:1)
```

```
Match
├── id: string
├── requestId: string (FK → Request, unique)
├── csrRepId: string (FK → CSRRep)
├── pinId: string (FK → PIN)
├── status: MatchStatus (enum)
├── matchedAt: DateTime
├── completedAt: DateTime?
└── Relations:
    ├── Request (1:1)
    ├── CSRRep (many:1)
    └── PIN (many:1)
```

---

## 🎮 Controllers (API Handlers)

### AuthController
```typescript
class AuthController {
  static registerPIN()      // POST /api/auth/register/pin
  static registerCSRRep()   // POST /api/auth/register/csrrep
  static login()            // POST /api/auth/login
  static getProfile()       // GET /api/auth/profile
  static updatePassword()   // PUT /api/auth/password
}
```

### AdminController
```typescript
class AdminController {
  static getUsers()         // GET /api/admin/users
  static getUserById()      // GET /api/admin/users/:id
  static createUser()       // POST /api/admin/users
  static updateUserStatus() // PUT /api/admin/users/:id/status
  static deleteUser()       // DELETE /api/admin/users/:id
  static getSystemStats()   // GET /api/admin/stats
}
```

### RequestController
```typescript
class RequestController {
  static createRequest()    // POST /api/requests
  static getRequests()      // GET /api/requests
  static getRequest()       // GET /api/requests/:id
  static getMyRequests()    // GET /api/requests/my
  static updateRequest()    // PUT /api/requests/:id
  static deleteRequest()    // DELETE /api/requests/:id
  static getCategories()    // GET /api/categories
}
```

### CSRRepController
```typescript
class CSRRepController {
  static shortlistRequest()    // POST /api/csrrep/shortlist
  static removeShortlist()     // DELETE /api/csrrep/shortlist/:id
  static getShortlists()       // GET /api/csrrep/shortlists
  static submitOffer()         // POST /api/csrrep/offer
  static getMyOffers()         // GET /api/csrrep/offers
  static getMyMatches()        // GET /api/csrrep/matches
}
```

### PINController
```typescript
class PINController {
  static getProfile()              // GET /api/pin/profile
  static updateProfile()           // PUT /api/pin/profile
  static getMyMatches()            // GET /api/pin/matches
  static getNotifications()        // GET /api/pin/notifications
  static markNotificationRead()    // PUT /api/pin/notifications/:id
}
```

---

## 🔧 Services (Business Logic)

### UserService
```typescript
class UserService {
  - userRepository: UserRepository
  
  + createUser(userData)
  + getUserById(id)
  + updateUser(id, updates)
  + deleteUser(id)
  + getAllUsers(limit, offset)
}
```

### MatchingService
```typescript
class MatchingService {
  - matchingRepository: MatchingRepository
  - volunteerRepository: VolunteerRepository
  - opportunityRepository: CSROpportunityRepository
  
  + findMatchesForVolunteer(volunteerId)
  - calculateMatchScore(volunteer, opportunity)
  - generateMatchReasons(volunteer, opportunity)
}
```

---

## 🗃️ Repositories (Data Access)

### UserRepository Interface
```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(user: Partial<User>): Promise<User>
  update(id: string, updates: Partial<User>): Promise<User | null>
  delete(id: string): Promise<boolean>
  findAll(limit?, offset?): Promise<User[]>
}
```

---

## 🎨 Frontend Components

### Authentication
```typescript
class LoginPage {
  - email: string
  - password: string
  - authService: AuthService
  
  + handleSubmit(e)
  + validateForm()
}
```

### Admin
```typescript
class AdminDashboard {
  - users: User[]
  - selectedUser: User
  - adminService: AdminService
  
  + fetchUsers()
  + handleCreateUser(data)
  + handleUpdateUser(id, data)
  + handleSuspendUser(id)
}
```

### Modals
```typescript
class CreateUserModal {
  - formData: object
  - userTypes: string[]
  
  + handleInputChange(e)
  + handleSubmit(e)
  + resetForm()
}
```

---

## 📊 Enums

### UserType
```typescript
enum UserType {
  PIN              // Person-In-Need
  CSR_REP          // CSR Representative
  ADMIN            // Administrator
  PLATFORM_MANAGER // Platform Manager
}
```

### UserStatus
```typescript
enum UserStatus {
  ACTIVE       // Can login and use system
  SUSPENDED    // Temporarily disabled
  DEACTIVATED  // Permanently disabled
}
```

### RequestStatus
```typescript
enum RequestStatus {
  ACTIVE      // Open for matching
  MATCHED     // Matched with CSR Rep
  COMPLETED   // Help completed
  CANCELLED   // Cancelled by PIN
}
```

### UrgencyLevel
```typescript
enum UrgencyLevel {
  LOW
  MEDIUM
  HIGH
}
```

### OfferStatus
```typescript
enum OfferStatus {
  PENDING   // Awaiting PIN response
  ACCEPTED  // PIN accepted offer
  DECLINED  // PIN declined offer
}
```

### MatchStatus
```typescript
enum MatchStatus {
  ACTIVE      // Currently active
  COMPLETED   // Successfully completed
  CANCELLED   // Cancelled by either party
}
```

---

## 🔗 Key Relationships

### User → Profile (1:1)
```
User ──────── PIN
User ──────── CSRRep  
User ──────── PlatformManager
```

### Request Lifecycle
```
PIN creates Request
    ↓
CSRRep views Request (increments viewCount)
    ↓
CSRRep shortlists Request (increments shortlistCount)
    ↓
CSRRep submits VolunteerOffer
    ↓
PIN accepts/declines Offer
    ↓
If accepted → Match created
    ↓
Match completed/cancelled
```

### Notification Flow
```
Event occurs (Offer, Match, etc.)
    ↓
Notification created for User
    ↓
User receives notification
    ↓
User marks as read
```

---

## 🛣️ Request Flow Examples

### 1. User Login
```
User → LoginPage → AuthService → POST /api/auth/login
→ AuthController → Prisma.user.findUnique()
→ comparePassword() → generateToken()
→ Return {user, token}
```

### 2. Create Request (PIN)
```
PIN → RequestForm → RequestService → POST /api/requests
→ RequestController → Prisma.request.create()
→ Return new Request
```

### 3. Shortlist Request (CSR Rep)
```
CSRRep → RequestList → CSRRepService → POST /api/csrrep/shortlist
→ CSRRepController → Prisma.shortlist.create()
→ Increment shortlistCount → Return Shortlist
```

### 4. Submit Offer (CSR Rep)
```
CSRRep → OfferForm → CSRRepService → POST /api/csrrep/offer
→ CSRRepController → Prisma.volunteerOffer.create()
→ Create Notification for PIN → Return Offer
```

---

## 📝 Important Methods

### Entity Methods
```typescript
// User
user.getProfile()              // Returns PIN | CSRRep | PlatformManager
user.updateStatus(status)      // Updates user status
user.validatePassword(pwd)     // Checks password

// Request
request.incrementViewCount()   // Adds 1 to viewCount
request.incrementShortlistCount()  // Adds 1 to shortlistCount
request.updateStatus(status)   // Changes request status

// Match
match.complete()              // Sets status to COMPLETED
match.cancel(reason)          // Sets status to CANCELLED

// Notification
notification.markAsRead()     // Sets isRead to true
```

### Controller Static Methods
```typescript
// All controllers have similar pattern:
static async methodName(
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void>
```

### Service Methods
```typescript
// All services return ApiResponse<T>:
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

---

## 🔐 Authentication Flow

```
1. User submits credentials
   ↓
2. AuthController.login()
   ↓
3. Find user by email
   ↓
4. Compare password (bcrypt)
   ↓
5. Generate JWT token
   ↓
6. Return {user, token}
   ↓
7. Client stores token
   ↓
8. Subsequent requests include token in headers
   ↓
9. Auth middleware validates token
   ↓
10. Attach user info to req.user
```

---

## 🎯 Quick Reference

### Creating a New Entity
1. Add to `schema.prisma`
2. Run `npx prisma migrate dev`
3. Add TypeScript interface to `/types`
4. Create controller methods
5. Add routes
6. Create service methods (if needed)
7. Update frontend types

### Adding a New Feature
1. **Boundary**: Create/update React component
2. **Controller**: Add controller method
3. **Service**: Add business logic (if needed)
4. **Entity**: Update database model (if needed)
5. **Routes**: Add new route
6. **Types**: Update TypeScript interfaces

---

## 📚 File Locations

### Backend
```
server/src/
├── entities/          # Entity interfaces
├── controllers/       # Request handlers
├── services/          # Business logic
├── repositories/      # Data access interfaces
├── routes/            # API routes
├── middleware/        # Auth, validation, errors
└── utils/             # Helper functions
```

### Frontend
```
client/src/
├── components/        # React components
├── services/          # API service classes
├── types/             # TypeScript interfaces
└── config/            # Configuration
```

### Database
```
server/prisma/
├── schema.prisma      # Database schema
├── migrations/        # Migration files
└── seed.ts            # Seed data
```

---

## 🚀 Common Operations Cheat Sheet

### Get all users (Admin)
```
GET /api/admin/users?page=1&limit=10
```

### Create user (Admin)
```
POST /api/admin/users
Body: {email, password, userType, ...profileData}
```

### Create request (PIN)
```
POST /api/requests
Headers: {Authorization: Bearer <token>}
Body: {categoryId, title, description, urgency}
```

### Shortlist request (CSR Rep)
```
POST /api/csrrep/shortlist
Headers: {Authorization: Bearer <token>}
Body: {requestId}
```

### Submit offer (CSR Rep)
```
POST /api/csrrep/offer
Headers: {Authorization: Bearer <token>}
Body: {requestId, message}
```

---

**Last Updated**: $(date)  
**For More Details**: See CLASS_DIAGRAMS.md and CLASS_DIAGRAMS_MERMAID.md

