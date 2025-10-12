# BCE ARCHITECTURE - ONE-PAGE CHEAT SHEET

```
╔════════════════════════════════════════════════════════════════════════════╗
║                    CSR VOLUNTEER MATCHING SYSTEM                           ║
║                        BCE QUICK REFERENCE                                 ║
╚════════════════════════════════════════════════════════════════════════════╝
```

## 🎯 THE 3 LAYERS

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🚪 BOUNDARY = Waiter (Takes orders, serves food)                        │
│     WHERE: routes/                                                       │
│     JOB: Define API endpoints, route requests                            │
│     EXAMPLE: router.post('/login', AuthController.login)                 │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  🧠 CONTROL = Chef (Cooks food, follows recipes)                         │
│     WHERE: controllers/, middleware/                                     │
│     JOB: Business logic, validation, coordination                        │
│     EXAMPLE: Check password, generate token, create match                │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  💾 ENTITY = Ingredients (The actual food & recipes)                     │
│     WHERE: prisma/schema.prisma                                          │
│     JOB: Data models, database structure                                 │
│     EXAMPLE: model User { id, email, password, ... }                     │
└──────────────────────────────────────────────────────────────────────────┘
```

## 🔄 THE FLOW

```
USER → BOUNDARY → CONTROL → ENTITY → DATABASE
 ↑                                        ↓
 └────────────────────────────────────────┘
         (Response flows back up)
```

## 📂 YOUR PROJECT MAP

```
server/src/
│
├─ 🚪 routes/                    ← BOUNDARY
│  ├─ auth.ts                   /api/auth/*
│  ├─ opportunities.ts          /api/opportunities/*
│  ├─ volunteers.ts             /api/volunteers/*
│  ├─ organizations.ts          /api/organizations/*
│  └─ matches.ts                /api/matches/*
│
├─ 🧠 controllers/               ← CONTROL
│  ├─ auth.controller.ts        Login, Register
│  ├─ request.controller.ts     Create, View requests
│  ├─ pin.controller.ts         PIN operations
│  ├─ csrRep.controller.ts      CSR Rep operations
│  └─ match.controller.ts       Matching logic
│
├─ 🧠 middleware/                ← CONTROL
│  ├─ auth.ts                   JWT verification
│  ├─ validation.ts             Input validation
│  └─ errorHandler.ts           Error handling
│
└─ 💾 prisma/                    ← ENTITY
   └─ schema.prisma             User, Request, Match models
```

## 💡 QUICK ANSWERS

| Question | Answer |
|----------|--------|
| Add new API endpoint? | `routes/` (Boundary) |
| Change business logic? | `controllers/` (Control) |
| Add database field? | `schema.prisma` (Entity) |
| Validate input? | `controllers/` or `middleware/` (Control) |
| Fix login bug? | `auth.controller.ts` (Control) |
| Change User model? | `schema.prisma` (Entity) |

## 🎬 EXAMPLE: User Login

```typescript
// 1️⃣ BOUNDARY (routes/auth.ts)
router.post('/login', 
  validateRequest(loginRules),
  AuthController.login
);

// 2️⃣ CONTROL (controllers/auth.controller.ts)
static async login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) throw new AppError('Invalid credentials', 401);
  
  const valid = await comparePassword(password, user.password);
  if (!valid) throw new AppError('Invalid credentials', 401);
  
  const token = generateToken({ userId: user.id });
  res.json({ user, token });
}

// 3️⃣ ENTITY (prisma/schema.prisma)
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  userType  UserType
  pin       PIN?
  csrRep    CSRRep?
}
```

## ✅ WHY BCE?

```
┌─────────────────────┬─────────────────────────────────────────┐
│ Benefit             │ Why It Matters                          │
├─────────────────────┼─────────────────────────────────────────┤
│ 🧹 Clean Code        │ Each file has ONE job                   │
│ 🔍 Easy Debugging    │ Know exactly where to look              │
│ 👥 Team Collaboration│ Work in parallel without conflicts      │
│ 🔄 Flexibility       │ Change one layer without breaking rest  │
│ 🧪 Testability       │ Test each layer independently           │
└─────────────────────┴─────────────────────────────────────────┘
```

## 🛠️ ADDING A NEW FEATURE

```
STEP 1: ENTITY (What data?)
└─ Add model to schema.prisma
   model Feature {
     id   String @id
     name String
   }

STEP 2: CONTROL (What logic?)
└─ Add controller
   static async create(req, res) {
     const feature = await prisma.feature.create({
       data: req.body
     });
     res.json({ feature });
   }

STEP 3: BOUNDARY (What endpoint?)
└─ Add route
   router.post('/features', 
     FeatureController.create
   );
```

## 🐛 DEBUGGING GUIDE

```
Issue                        → Check This Layer
─────────────────────────────────────────────────
API endpoint not found       → BOUNDARY (routes/)
Wrong HTTP method            → BOUNDARY (routes/)
Validation error             → CONTROL (controllers/, middleware/)
Business logic error         → CONTROL (controllers/)
Database field missing       → ENTITY (schema.prisma)
Query error                  → ENTITY (schema.prisma)
```

## 📋 THE RULES

```
1. BOUNDARY only routes requests (no business logic!)
2. CONTROL only processes logic (no database models!)
3. ENTITY only defines data (no HTTP handling!)
4. Layers talk ONLY to neighbors (B↔C↔E)
5. Data flows: Request → B → C → E → DB → C → B → Response
```

## 🎯 REMEMBER

```
╔═══════════════════════════════════════╗
║  WHERE?  →  BOUNDARY  →  routes/      ║
║   HOW?   →  CONTROL   →  controllers/ ║
║  WHAT?   →  ENTITY    →  prisma/      ║
╚═══════════════════════════════════════╝
```

---

**📚 Need More Details?**
- `BCE_SIMPLE_GUIDE.md` - Expanded explanations
- `BCE_ARCHITECTURE.md` - Complete deep dive
- `BCE_PRESENTATION.md` - Slide deck for presentations

**🚀 Ready to Code?**
- `START_STOP_GUIDE.md` - How to run the project
- `API_DOCUMENTATION.md` - All API endpoints

---

*Made with 💙 for CSIT314 Project | Print this for quick reference!*

