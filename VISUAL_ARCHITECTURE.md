# 📊 Visual Architecture Guide

> **See exactly how your application is structured with diagrams and flowcharts**

---

## 🏗️ Overall System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   CLIENT (FRONTEND)                          │   │
│  │                   Location: client/                          │   │
│  │                   Port: 3000                                 │   │
│  │                                                              │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐            │   │
│  │  │ LoginPage  │  │ Dashboard  │  │  Request   │            │   │
│  │  │   .tsx     │  │   .tsx     │  │   Form     │  ...more   │   │
│  │  └────────────┘  └────────────┘  └────────────┘            │   │
│  │        ↓                ↓                ↓                   │   │
│  │  ┌─────────────────────────────────────────────────┐        │   │
│  │  │            SERVICES (API Calls)                 │        │   │
│  │  │  authService | requestService | adminService    │        │   │
│  │  └─────────────────────────────────────────────────┘        │   │
│  └──────────────────────────────────┬──────────────────────────┘   │
└─────────────────────────────────────┼──────────────────────────────┘
                                      │
                          HTTP Requests (JSON)
                          GET, POST, PUT, DELETE
                                      │
                                      ↓
┌─────────────────────────────────────┴──────────────────────────────┐
│                    SERVER (BACKEND)                                 │
│                    Location: server/                                │
│                    Port: 4000                                       │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    🛣️  ROUTES (API Endpoints)                 │  │
│  │                                                               │  │
│  │  /api/auth         → authRoutes                               │  │
│  │  /api/opportunities → opportunityRoutes                       │  │
│  │  /api/admin        → adminRoutes                              │  │
│  │  /api/matches      → matchRoutes                              │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              🛡️  MIDDLEWARE (Security Layer)                  │  │
│  │                                                               │  │
│  │  • authenticate()    - Check if user is logged in            │  │
│  │  • authorize()       - Check user permissions                │  │
│  │  • validateRequest() - Validate input data                   │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              🎮  CONTROLLERS (Business Logic)                 │  │
│  │                                                               │  │
│  │  • AuthController        - Login, Register                   │  │
│  │  • RequestController     - CRUD Requests                     │  │
│  │  • AdminController       - User Management                   │  │
│  │  • MatchController       - Matching Logic                    │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              🔧  UTILS (Helper Functions)                     │  │
│  │                                                               │  │
│  │  • jwt.ts        - Token generation/verification             │  │
│  │  • password.ts   - Hash/compare passwords                    │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                   Prisma ORM (Database Queries)
                               │
                               ↓
┌──────────────────────────────┴──────────────────────────────────────┐
│                    💾  DATABASE (PostgreSQL)                         │
│                    Location: Docker Container                        │
│                    Port: 5432                                        │
│                                                                      │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────────┐     │
│  │   User    │  │    PIN    │  │  CSRRep   │  │   Request    │     │
│  │  Table    │  │  Table    │  │  Table    │  │   Table      │     │
│  └───────────┘  └───────────┘  └───────────┘  └──────────────┘     │
│                                                                      │
│  ┌───────────┐  ┌───────────┐  ┌────────────────┐                  │
│  │   Match   │  │ Category  │  │ PlatformManager│  ...more          │
│  │  Table    │  │  Table    │  │    Table       │                   │
│  └───────────┘  └───────────┘  └────────────────┘                  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 BCE Architecture Mapping

```
┌────────────────────────────────────────────────────────────────────┐
│                       BCE FRAMEWORK LAYERS                          │
└────────────────────────────────────────────────────────────────────┘

🚪 BOUNDARY LAYER (User Interface + API Interface)
├─────────────────────────────────────────────────────────────────────
│
│  Frontend Boundary (client/)
│  ┌─────────────────────────────────────┐
│  │  components/                        │ → What users see and interact with
│  │  ├── LoginPage.tsx                  │ → Login form
│  │  ├── Dashboard.tsx                  │ → Main dashboard
│  │  ├── AdminDashboard.tsx             │ → Admin panel
│  │  └── CreateUserModal.tsx            │ → User creation
│  │                                     │
│  │  services/                          │ → Communication with backend
│  │  ├── authService.ts                 │ → Login/register calls
│  │  ├── requestService.ts              │ → Request management calls
│  │  └── adminService.ts                │ → Admin operation calls
│  └─────────────────────────────────────┘
│
│  Backend Boundary (server/src/)
│  ┌─────────────────────────────────────┐
│  │  routes/                            │ → API endpoints (URLs)
│  │  ├── auth.ts                        │ → /api/auth/*
│  │  ├── opportunities.ts               │ → /api/opportunities/*
│  │  ├── admin.ts                       │ → /api/admin/*
│  │  └── matches.ts                     │ → /api/matches/*
│  └─────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────

👨‍💼 CONTROL LAYER (Business Logic + Rules)
├─────────────────────────────────────────────────────────────────────
│
│  server/src/
│  ┌─────────────────────────────────────┐
│  │  controllers/                       │ → Main business logic
│  │  ├── auth.controller.ts             │ → Login/register logic
│  │  │   ├── registerPIN()              │   • Validate input
│  │  │   ├── registerCSRRep()           │   • Hash passwords
│  │  │   ├── login()                    │   • Generate tokens
│  │  │   └── getProfile()               │   • Check permissions
│  │  │                                  │
│  │  ├── request.controller.ts          │ → Request management
│  │  │   ├── createRequest()            │   • Validate request
│  │  │   ├── getRequests()              │   • Filter by status
│  │  │   ├── updateRequest()            │   • Check ownership
│  │  │   └── deleteRequest()            │   • Soft delete
│  │  │                                  │
│  │  └── admin.controller.ts            │ → Admin operations
│  │      ├── createUser()               │   • Check admin rights
│  │      ├── suspendUser()              │   • Audit logging
│  │      └── searchUsers()              │   • Advanced filtering
│  │                                     │
│  │  middleware/                        │ → Security & validation
│  │  ├── auth.ts                        │ → JWT verification
│  │  ├── validation.ts                  │ → Input validation
│  │  └── errorHandler.ts                │ → Error processing
│  │                                     │
│  │  utils/                             │ → Helper functions
│  │  ├── jwt.ts                         │ → Token management
│  │  └── password.ts                    │ → Password security
│  └─────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────

📦 ENTITY LAYER (Data Models + Persistence)
├─────────────────────────────────────────────────────────────────────
│
│  server/prisma/
│  ┌─────────────────────────────────────┐
│  │  schema.prisma                      │ → Database schema
│  │                                     │
│  │  model User {                       │ → User accounts
│  │    id        String                 │
│  │    email     String   @unique       │
│  │    password  String                 │
│  │    userType  UserType               │
│  │    status    UserStatus             │
│  │  }                                  │
│  │                                     │
│  │  model Request {                    │ → PIN requests
│  │    id          String               │
│  │    title       String               │
│  │    description String               │
│  │    status      RequestStatus        │
│  │  }                                  │
│  │                                     │
│  │  model Match {                      │ → PIN-CSR matches
│  │    id         String                │
│  │    requestId  String                │
│  │    csrRepId   String                │
│  │    status     MatchStatus           │
│  │  }                                  │
│  └─────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────
```

---

## 🔄 Data Flow: Login Example (Detailed)

```
┌────────────────────────────────────────────────────────────────────┐
│  STEP 1: User Interaction                                           │
└────────────────────────────────────────────────────────────────────┘

    User opens browser → http://localhost:3000/login
                              ↓
    ┌──────────────────────────────────────┐
    │  LoginPage.tsx renders               │
    │  • Shows email input                 │
    │  • Shows password input              │
    │  • Shows login button                │
    └──────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  STEP 2: User submits form                                          │
└────────────────────────────────────────────────────────────────────┘

    User enters: email = "pin@example.com"
                password = "password123"
    User clicks: [Login Button]
                              ↓
    ┌──────────────────────────────────────┐
    │  handleSubmit() function runs        │
    │  • Validates email format            │
    │  • Checks password not empty         │
    │  • Calls authService.login()         │
    └──────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  STEP 3: Frontend Service sends HTTP request                        │
└────────────────────────────────────────────────────────────────────┘

    authService.login({ email, password })
                              ↓
    ┌──────────────────────────────────────┐
    │  api.post('/auth/login', {           │
    │    email: "pin@example.com",         │
    │    password: "password123"           │
    │  })                                  │
    │                                      │
    │  Sends HTTP POST to:                 │
    │  http://localhost:4000/api/auth/login│
    └──────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  STEP 4: Backend receives request                                   │
└────────────────────────────────────────────────────────────────────┘

    Express server.ts receives POST request
                              ↓
    ┌──────────────────────────────────────┐
    │  app.use('/api/auth', authRoutes)    │
    │  → Directs to auth.ts route file     │
    └──────────────────────────────────────┘
                              ↓
    ┌──────────────────────────────────────┐
    │  routes/auth.ts                      │
    │  router.post('/login',               │
    │    AuthController.login              │
    │  )                                   │
    └──────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  STEP 5: Controller processes request                               │
└────────────────────────────────────────────────────────────────────┘

    AuthController.login(req, res) executes
                              ↓
    ┌──────────────────────────────────────┐
    │  1. Extract email & password         │
    │     const { email, password } =      │
    │       req.body                       │
    │                                      │
    │  2. Query database                   │
    │     const user =                     │
    │       await prisma.user.findUnique({ │
    │         where: { email }             │
    │       })                             │
    │                                      │
    │  3. Validate user exists             │
    │     if (!user) throw error           │
    │                                      │
    │  4. Check account status             │
    │     if (status !== ACTIVE) error     │
    │                                      │
    │  5. Verify password                  │
    │     const valid =                    │
    │       await comparePassword(...)     │
    │     if (!valid) throw error          │
    │                                      │
    │  6. Generate JWT token               │
    │     const token = generateToken({    │
    │       userId, email, userType        │
    │     })                               │
    │                                      │
    │  7. Send response                    │
    │     res.json({ user, token })        │
    └──────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  STEP 6: Database interaction (via Prisma)                          │
└────────────────────────────────────────────────────────────────────┘

    prisma.user.findUnique({ where: { email } })
                              ↓
    ┌──────────────────────────────────────┐
    │  Prisma generates SQL:               │
    │                                      │
    │  SELECT * FROM "User"                │
    │  WHERE email = 'pin@example.com'     │
    │  LIMIT 1;                            │
    └──────────────────────────────────────┘
                              ↓
    ┌──────────────────────────────────────┐
    │  PostgreSQL returns:                 │
    │  {                                   │
    │    id: "uuid-123",                   │
    │    email: "pin@example.com",         │
    │    password: "$2b$10$hashed...",     │
    │    userType: "PIN",                  │
    │    status: "ACTIVE"                  │
    │  }                                   │
    └──────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  STEP 7: Response sent back to frontend                             │
└────────────────────────────────────────────────────────────────────┘

    Controller sends JSON response:
    {
      message: "Login successful",
      user: {
        id: "uuid-123",
        email: "pin@example.com",
        userType: "PIN"
      },
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
                              ↓
    HTTP 200 OK response travels back to client

┌────────────────────────────────────────────────────────────────────┐
│  STEP 8: Frontend receives response                                 │
└────────────────────────────────────────────────────────────────────┘

    authService.login() promise resolves
                              ↓
    ┌──────────────────────────────────────┐
    │  onSuccess callback runs:            │
    │                                      │
    │  1. Store token                      │
    │     localStorage.setItem(            │
    │       'token',                       │
    │       response.data.token            │
    │     )                                │
    │                                      │
    │  2. Store user info                  │
    │     localStorage.setItem(            │
    │       'user',                        │
    │       JSON.stringify(user)           │
    │     )                                │
    │                                      │
    │  3. Navigate to dashboard            │
    │     if (userType === 'PIN') {        │
    │       navigate('/pin/dashboard')     │
    │     }                                │
    └──────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  STEP 9: User sees dashboard                                        │
└────────────────────────────────────────────────────────────────────┘

    Browser URL changes to: /pin/dashboard
                              ↓
    ┌──────────────────────────────────────┐
    │  Dashboard.tsx renders               │
    │  • Loads user requests               │
    │  • Shows welcome message             │
    │  • Displays navigation menu          │
    └──────────────────────────────────────┘

    ✅ LOGIN COMPLETE!
```

---

## 📁 File Relationships Diagram

```
client/
│
├── components/LoginPage.tsx
│        │
│        │ imports
│        ↓
├── services/authService.ts
│        │
│        │ uses
│        ↓
└── config/api.ts (axios instance)
         │
         │ HTTP POST
         ↓
    ┌────────────────┐
    │   NETWORK      │
    │   (port 4000)  │
    └────────────────┘
         │
         ↓
server/
│
├── server.ts (Express app)
│        │
│        │ routes to
│        ↓
├── routes/auth.ts
│        │
│        │ calls
│        ↓
├── controllers/auth.controller.ts
│        │
│        │ uses
│        ↓
├── utils/password.ts
│   └── comparePassword()
│        │
│        │ queries
│        ↓
└── prisma/schema.prisma
         │
         │ generates
         ↓
    PrismaClient
         │
         │ SQL queries
         ↓
    ┌────────────────┐
    │  PostgreSQL    │
    │  (port 5432)   │
    └────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│  FIRST REQUEST: Login                                        │
└─────────────────────────────────────────────────────────────┘

User → POST /api/auth/login
       { email, password }
              ↓
       AuthController.login()
              ↓
       Verify credentials
              ↓
       Generate JWT token
              ↓
       Return { user, token }
              ↓
       Store in localStorage


┌─────────────────────────────────────────────────────────────┐
│  SUBSEQUENT REQUESTS: Protected endpoints                    │
└─────────────────────────────────────────────────────────────┘

User → GET /api/opportunities
       Headers: {
         Authorization: "Bearer eyJhbG..."
       }
              ↓
       authenticate() middleware
              ↓
       ┌─────────────────────────┐
       │ 1. Extract token        │
       │ 2. Verify signature     │
       │ 3. Check expiration     │
       │ 4. Decode payload       │
       │ 5. Attach to req.user   │
       └─────────────────────────┘
              ↓
       authorize(['PIN', 'CSR_REP']) middleware
              ↓
       ┌─────────────────────────┐
       │ Check if userType       │
       │ is allowed              │
       └─────────────────────────┘
              ↓
       RequestController.getRequests()
              ↓
       Return filtered requests
```

---

## 🎯 Request Lifecycle

```
┌────────────────────────────────────────────────────────────────┐
│  Example: CSR Rep shortlists a request                         │
└────────────────────────────────────────────────────────────────┘

1. UI INTERACTION
   ┌──────────────────────────┐
   │ User clicks [Shortlist]  │
   │ button on RequestCard    │
   └──────────────────────────┘
              ↓

2. FRONTEND SERVICE
   ┌──────────────────────────────────────┐
   │ csrRepService.shortlistRequest(id)   │
   │                                      │
   │ POST /api/organizations/shortlist    │
   │ Body: { requestId: "123" }           │
   │ Headers: {                           │
   │   Authorization: "Bearer token..."   │
   │ }                                    │
   └──────────────────────────────────────┘
              ↓

3. BACKEND ROUTE
   ┌──────────────────────────────────────┐
   │ routes/organizations.ts              │
   │                                      │
   │ router.post('/shortlist',            │
   │   authenticate,      ← Check logged  │
   │   authorize(['CSR_REP']), ← Check role│
   │   CSRRepController.shortlist         │
   │ )                                    │
   └──────────────────────────────────────┘
              ↓

4. MIDDLEWARE CHAIN
   ┌──────────────────────────────────────┐
   │ authenticate()                       │
   │ • Verify JWT token                   │
   │ • Extract user info                  │
   │ • Attach to req.user                 │
   └──────────────────────────────────────┘
              ↓
   ┌──────────────────────────────────────┐
   │ authorize(['CSR_REP'])               │
   │ • Check req.user.userType            │
   │ • Allow if CSR_REP                   │
   │ • Reject otherwise                   │
   └──────────────────────────────────────┘
              ↓

5. CONTROLLER LOGIC
   ┌──────────────────────────────────────┐
   │ CSRRepController.shortlist()         │
   │                                      │
   │ const { requestId } = req.body       │
   │ const csrRepId = req.user.csrRepId   │
   │                                      │
   │ const shortlist = await              │
   │   prisma.shortlist.create({          │
   │     data: { requestId, csrRepId }    │
   │   })                                 │
   │                                      │
   │ res.json({ shortlist })              │
   └──────────────────────────────────────┘
              ↓

6. DATABASE OPERATION
   ┌──────────────────────────────────────┐
   │ PostgreSQL                           │
   │                                      │
   │ INSERT INTO "Shortlist"              │
   │ (id, requestId, csrRepId, createdAt) │
   │ VALUES (...)                         │
   │                                      │
   │ → Returns inserted row               │
   └──────────────────────────────────────┘
              ↓

7. RESPONSE TO FRONTEND
   ┌──────────────────────────────────────┐
   │ JSON Response:                       │
   │ {                                    │
   │   shortlist: {                       │
   │     id: "uuid-456",                  │
   │     requestId: "123",                │
   │     csrRepId: "789"                  │
   │   }                                  │
   │ }                                    │
   └──────────────────────────────────────┘
              ↓

8. UI UPDATE
   ┌──────────────────────────────────────┐
   │ Frontend updates:                    │
   │ • Show "Shortlisted" badge           │
   │ • Add to shortlist page              │
   │ • Show success notification          │
   └──────────────────────────────────────┘
```

---

## 🗂️ Database Schema Relationships

```
                    ┌─────────────┐
                    │    User     │
                    │─────────────│
                    │ id (PK)     │
                    │ email       │
                    │ password    │
                    │ userType    │
                    │ status      │
                    └──────┬──────┘
                           │ (1:1)
              ┌────────────┼────────────┐
              │            │            │
              ↓            ↓            ↓
       ┌──────────┐  ┌──────────┐  ┌─────────────────┐
       │   PIN    │  │  CSRRep  │  │ PlatformManager │
       │──────────│  │──────────│  │─────────────────│
       │ id (PK)  │  │ id (PK)  │  │ id (PK)         │
       │ userId(FK)│  │ userId(FK)│  │ userId (FK)    │
       │ name     │  │ company  │  │ department      │
       │ age      │  │ industry │  └─────────────────┘
       └────┬─────┘  └────┬─────┘
            │             │
            │ (1:N)       │ (1:N)
            ↓             ↓
     ┌────────────┐  ┌──────────────┐
     │  Request   │  │  Shortlist   │
     │────────────│  │──────────────│
     │ id (PK)    │  │ id (PK)      │
     │ pinId (FK) │←─│ requestId(FK)│
     │ categoryId │  │ csrRepId (FK)│─┐
     │ title      │  └──────────────┘ │
     │ status     │                   │
     └────┬───────┘                   │
          │                           │
          │ (1:N)                     │
          ↓                           │
   ┌──────────────────┐               │
   │ VolunteerOffer   │               │
   │──────────────────│               │
   │ id (PK)          │               │
   │ requestId (FK)   │───────────────┘
   │ csrRepId (FK)    │
   │ offerDetails     │
   │ status           │
   └────┬─────────────┘
        │
        │ (1:1)
        ↓
   ┌──────────────┐
   │    Match     │
   │──────────────│
   │ id (PK)      │
   │ requestId(FK)│
   │ csrRepId (FK)│
   │ status       │
   └──────────────┘
```

---

## 📝 Quick Reference

### File → Purpose Mapping

| File Path | Purpose | Contains |
|-----------|---------|----------|
| `client/src/components/` | UI Components | React components users see |
| `client/src/services/` | API Calls | Functions that talk to backend |
| `server/src/routes/` | URL Endpoints | API route definitions |
| `server/src/controllers/` | Business Logic | Main application logic |
| `server/src/middleware/` | Security | Authentication & validation |
| `server/src/utils/` | Helpers | Reusable utility functions |
| `server/prisma/schema.prisma` | Database Schema | Data model definitions |

### Technology Stack

```
┌────────────────────────────────────────┐
│           FRONTEND (Client)            │
│                                        │
│  React         → UI framework          │
│  TypeScript    → Type safety           │
│  Tailwind CSS  → Styling               │
│  React Query   → State management      │
│  Axios         → HTTP requests         │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│           BACKEND (Server)             │
│                                        │
│  Node.js       → Runtime               │
│  Express       → Web framework         │
│  TypeScript    → Type safety           │
│  Prisma        → Database ORM          │
│  JWT           → Authentication        │
│  Bcrypt        → Password hashing      │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│            DATABASE                    │
│                                        │
│  PostgreSQL    → Primary database      │
│  Docker        → Container platform    │
│  pgAdmin       → Database GUI          │
└────────────────────────────────────────┘
```

---

**🎓 Now you have a complete visual understanding of the architecture!**

See `COMPLETE_BEGINNER_GUIDE.md` for detailed explanations.

