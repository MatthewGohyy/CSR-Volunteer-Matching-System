# 🎯 BCE Architecture - Simple Guide

## 🍴 The Restaurant Analogy (30 seconds)

```
┌─────────────────────────────────────────────────────────┐
│              CSR VOLUNTEER MATCHING SYSTEM              │
└─────────────────────────────────────────────────────────┘

    🚪 BOUNDARY = Waiters          📂 Where: routes/
    (Take orders, serve food)      ├── auth.ts
                                   ├── opportunities.ts
                                   └── matches.ts

    👨‍🍳 CONTROL = Chefs             📂 Where: controllers/
    (Cook, follow recipes)         ├── auth.controller.ts
                                   ├── request.controller.ts
                                   └── match.controller.ts

    📦 ENTITY = Ingredients         📂 Where: prisma/
    (The actual food & recipes)    └── schema.prisma
```

---

## 🔄 Complete Flow (User Login Example)

```
1. USER                    →  Enters email & password
                              |
2. BOUNDARY (routes/)      →  POST /api/auth/login
   ├── Receives request
   ├── Validates format
   └── Routes to controller
                              |
3. CONTROL (controllers/)  →  AuthController.login
   ├── Check if email exists
   ├── Compare password hash
   ├── Generate JWT token
   └── Format response
                              |
4. ENTITY (Prisma)         →  Database Query
   └── SELECT * FROM User WHERE email = '...'
                              |
5. CONTROL                 →  Send response back
                              |
6. BOUNDARY                →  HTTP 200 { user, token }
                              |
7. USER                    →  See dashboard ✅
```

---

## 📊 Your Project Structure (Visual Map)

```
CSR-Volunteer-Matching-System/
└── server/src/

    🚪 BOUNDARY LAYER
    ├── routes/
    │   ├── auth.ts              → /api/auth/*
    │   ├── opportunities.ts     → /api/opportunities/*
    │   ├── volunteers.ts        → /api/volunteers/*
    │   ├── organizations.ts     → /api/organizations/*
    │   └── matches.ts           → /api/matches/*
    │
    └── validators/
        ├── auth.validator.ts    → Input validation rules
        └── request.validator.ts

    ────────────────────────────────────────────────────

    👨‍🍳 CONTROL LAYER
    ├── controllers/
    │   ├── auth.controller.ts      → Login, Register logic
    │   ├── request.controller.ts   → Create, view requests
    │   ├── pin.controller.ts       → PIN operations
    │   ├── csrRep.controller.ts    → CSR Rep operations
    │   └── match.controller.ts     → Match logic
    │
    ├── middleware/
    │   ├── auth.ts                 → JWT authentication
    │   ├── validation.ts           → Validate inputs
    │   └── errorHandler.ts         → Catch errors
    │
    └── utils/
        ├── jwt.ts                  → Token generation
        └── password.ts             → Password hashing

    ────────────────────────────────────────────────────

    📦 ENTITY LAYER
    └── prisma/
        └── schema.prisma           → Data models
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

