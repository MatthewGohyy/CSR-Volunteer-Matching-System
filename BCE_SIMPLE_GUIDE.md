# 🎯 BCE Architecture - Simple Guide
## Classical Boundary-Control-Entity Pattern

> **📝 Academic Note**: This guide uses the classical BCE interpretation (Jacobson's OOSE),  
> where Boundary = Frontend UI, Control = Backend Logic, Entity = Database.  
> This is the appropriate interpretation for academic reports.

## 🍴 The Restaurant Analogy (30 seconds)

```
┌─────────────────────────────────────────────────────────┐
│              CSR VOLUNTEER MATCHING SYSTEM              │
└─────────────────────────────────────────────────────────┘

    🚪 BOUNDARY = Dining Area       📂 Where: client/src/
    (Where customers interact)      ├── components/ (UI + API calls)
                                   ├── config/ (axios setup)
                                   └── React frontend

    👨‍🍳 CONTROL = Kitchen            📂 Where: server/src/
    (Where food is prepared)       ├── routes/ (endpoints)
                                   ├── controllers/ (logic)
                                   └── Node.js backend

    📦 ENTITY = Storage Room        📂 Where: server/prisma/
    (Where ingredients are stored) └── schema.prisma
```

---

## 🔄 Complete Flow (User Login Example)

```
1. USER                         →  Types in browser
                                   |
2. BOUNDARY (Frontend)          →  LoginPage.tsx
   ├── User enters email & password
   ├── Clicks login button
   └── api.post('/auth/login', credentials)
                                   | HTTP POST
3. CONTROL (Backend API)        →  POST /api/auth/login
   ├── routes/auth.ts receives request
   ├── Validates request format
   └── Calls AuthController.login
                                   |
4. CONTROL (Business Logic)     →  AuthController.login
   ├── Find user by email
   ├── Check password hash
   ├── Generate JWT token
   └── Format response
                                   | SQL Query
5. ENTITY (Database)            →  Prisma ORM
   └── SELECT * FROM User WHERE email = '...'
                                   | Result
6. CONTROL                      →  Format & send response
                                   | JSON
7. BOUNDARY (Frontend)          →  LoginPage.tsx receives response
   ├── Store JWT token in localStorage
   ├── Update UI state
   └── Navigate to dashboard
                                   |
8. USER                         →  See dashboard ✅
```

---

## 📊 Your Project Structure (Classical BCE Map)

```
CSR-Volunteer-Matching-System/

    🚪 BOUNDARY LAYER (Frontend - User Interface)
    └── client/src/
        ├── components/              → UI Components (with API calls)
        │   ├── LoginPage.tsx        → Login interface
        │   ├── AdminDashboard.tsx   → Admin interface
        │   ├── PINDashboard.tsx     → PIN dashboard
        │   ├── CSRRepDashboard.tsx  → CSR Rep dashboard
        │   ├── PlatformManagerDashboard.tsx → PM dashboard
        │   ├── CreateUserModal.tsx  → User forms
        │   └── UserDetailsModal.tsx → User details
        │
        ├── config/                  → Configuration
        │   └── api.ts               → Axios instance with interceptors
        │
        └── types/                   → TypeScript types
            └── index.ts             → Type definitions

    ────────────────────────────────────────────────────

    👨‍🍳 CONTROL LAYER (Backend - Business Logic)
    └── server/src/
        ├── routes/                  → API endpoints
        │   ├── auth.ts              → /api/auth/*
        │   ├── opportunities.ts     → /api/opportunities/*
        │   ├── admin.ts             → /api/admin/*
        │   └── matches.ts           → /api/matches/*
        │
        ├── controllers/             → Use case logic
        │   ├── auth.controller.ts   → Login, Register
        │   ├── request.controller.ts→ Request management
        │   ├── admin.controller.ts  → Admin operations
        │   └── match.controller.ts  → Matching logic
        │
        ├── middleware/              → Cross-cutting
        │   ├── auth.ts              → JWT authentication
        │   ├── validation.ts        → Input validation
        │   └── errorHandler.ts      → Error handling
        │
        └── utils/                   → Helpers
            ├── jwt.ts               → Token generation
            └── password.ts          → Password hashing

    ────────────────────────────────────────────────────

    📦 ENTITY LAYER (Backend - Data Persistence)
    └── server/prisma/
        └── schema.prisma            → Data models
            ├── User
            ├── PIN
            ├── CSRRep
            ├── Request
            ├── VolunteerOffer
            └── Match
```

---

## 🎬 Real Code Example (Creating a Request)

### 1️⃣ BOUNDARY: Define the endpoint
```typescript
// routes/opportunities.ts
router.post('/', 
  authenticate,                    // ✅ Check JWT
  authorize(['PIN']),              // ✅ Only PINs can create
  validateRequest(createRules),    // ✅ Validate input
  RequestController.createRequest  // → Send to controller
);
```

### 2️⃣ CONTROL: Business logic
```typescript
// controllers/request.controller.ts
static async createRequest(req, res) {
  const { categoryId, title, description, urgency } = req.body;
  const pinId = req.user.pinId;
  
  // 🧠 Business logic
  const request = await prisma.request.create({
    data: {
      pinId,
      categoryId,
      title,
      description,
      urgency,
      status: 'ACTIVE'
    }
  });
  
  res.status(201).json({ request });
}
```

### 3️⃣ ENTITY: Database structure
```prisma
// prisma/schema.prisma
model Request {
  id          String        @id @default(uuid())
  pinId       String
  categoryId  String
  title       String
  description String
  urgency     UrgencyLevel
  status      RequestStatus @default(ACTIVE)
  createdAt   DateTime      @default(now())
  
  pin         PIN              @relation(fields: [pinId], references: [id])
  category    ServiceCategory  @relation(fields: [categoryId], references: [id])
}
```

---

## ✅ Why BCE Matters

| Benefit | Explanation | Example |
|---------|-------------|---------|
| **🧹 Clean Code** | Each layer has ONE job | Routes don't contain SQL queries |
| **🔍 Easy Debugging** | Know exactly where to look | Login fails? Check `auth.controller.ts` |
| **👥 Team Work** | Work in parallel without conflicts | One person on routes, another on logic |
| **🔄 Flexibility** | Change one layer without breaking others | Switch from Prisma to MongoDB? Only touch Entity |
| **🧪 Testable** | Test each layer independently | Mock the database, test the logic |

---

## 🎓 Quick Reference

### When adding a new feature:

```
STEP 1: ENTITY (Define data)
└── Add to prisma/schema.prisma
    model NewFeature {
      id    String @id
      name  String
    }

STEP 2: CONTROL (Write logic)
└── Add to controllers/newFeature.controller.ts
    static async create(req, res) {
      // Business logic here
    }

STEP 3: BOUNDARY (Expose API)
└── Add to routes/newFeature.ts
    router.post('/features',
      NewFeatureController.create
    );
```

---

## 💡 Quick Answers

**Q: Which layer do I edit to add a new field to the database?**  
A: **ENTITY** → `prisma/schema.prisma`

**Q: Where do I add password validation rules?**  
A: **CONTROL** → `controllers/auth.controller.ts`

**Q: How do I create a new API endpoint?**  
A: **BOUNDARY** → `routes/*.ts`

**Q: Where is JWT token generation?**  
A: **CONTROL** → `utils/jwt.ts`

---

## 📝 Cheat Sheet

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  LAYER      │  QUESTION  │  LOCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BOUNDARY   │  WHERE?    │  routes/
  CONTROL    │  HOW?      │  controllers/ + middleware/
  ENTITY     │  WHAT?     │  prisma/schema.prisma
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Data Flow:**
```
Request → Boundary → Control → Entity → Database
                                          ↓
Response ← Boundary ← Control ← Entity ← Query Result
```

---

## 🎯 Key Takeaway

> **BCE keeps your code organized like a well-run restaurant:**  
> - Waiters (Boundary) don't cook  
> - Chefs (Control) don't serve tables  
> - Ingredients (Entity) don't walk around  
> 
> **Each part does its job → System works smoothly! ✨**

---

## 📞 Need Help?

- **Full Details:** See `BCE_ARCHITECTURE.md` for in-depth explanations
- **API Reference:** See `API_DOCUMENTATION.md` for all endpoints
- **Quick Start:** See `START_STOP_GUIDE.md` to run the project

---

**Made with 💙 for CSIT314 Project**

