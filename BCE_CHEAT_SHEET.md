# BCE ARCHITECTURE - ONE-PAGE CHEAT SHEET
## Classical Boundary-Control-Entity Pattern

```
╔════════════════════════════════════════════════════════════════════════════╗
║                    CSR VOLUNTEER MATCHING SYSTEM                           ║
║                  BCE QUICK REFERENCE (Academic Version)                    ║
╚════════════════════════════════════════════════════════════════════════════╝
```

> **📝 Academic Note**: This follows classical BCE (Jacobson's OOSE)  
> Boundary = Frontend | Control = Backend | Entity = Database

## 🎯 THE 3 LAYERS

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🚪 BOUNDARY = Dining Area (Where customers interact)                    │
│     WHERE: client/src/ (Frontend)                                        │
│     JOB: User interface, capture input, display results                  │
│     EXAMPLE: LoginPage.tsx, authService.login()                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  🧠 CONTROL = Kitchen (Where food is prepared)                           │
│     WHERE: server/src/ (Backend)                                         │
│     JOB: Business logic, API endpoints, use cases                        │
│     EXAMPLE: AuthController.login, routes/auth.ts                        │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  💾 ENTITY = Storage Room (Where ingredients are stored)                 │
│     WHERE: server/prisma/schema.prisma (Database)                        │
│     JOB: Data models, relationships, persistence                         │
│     EXAMPLE: model User { id, email, password, ... }                     │
└──────────────────────────────────────────────────────────────────────────┘
```

## 🔄 THE FLOW

```
USER → BOUNDARY (UI) → CONTROL (API) → ENTITY (DB) → DATABASE
       Frontend            Backend         Models
 ↑                                                      ↓
 └──────────────────────────────────────────────────────┘
         (Response flows back through all layers)
```

## 📂 YOUR PROJECT MAP

```
CSR-Volunteer-Matching-System/
│
├─ 🚪 client/src/                ← BOUNDARY (Frontend)
│  ├─ components/
│  │  ├─ LoginPage.tsx          User authentication UI
│  │  ├─ Dashboard.tsx          Main user dashboard
│  │  └─ AdminDashboard.tsx     Admin interface
│  │
│  └─ services/
│     ├─ authService.ts         Auth API calls
│     ├─ requestService.ts      Request API calls
│     └─ adminService.ts        Admin API calls
│
├─ 🧠 server/src/                ← CONTROL (Backend)
│  ├─ routes/                   API endpoints
│  │  ├─ auth.ts                /api/auth/*
│  │  ├─ opportunities.ts       /api/opportunities/*
│  │  └─ admin.ts               /api/admin/*
│  │
│  ├─ controllers/              Business logic
│  │  ├─ auth.controller.ts     Login, Register
│  │  ├─ request.controller.ts  Request management
│  │  └─ admin.controller.ts    Admin operations
│  │
│  └─ middleware/               Cross-cutting
│     ├─ auth.ts                JWT verification
│     └─ validation.ts          Input validation
│
└─ 💾 server/prisma/             ← ENTITY (Database)
   └─ schema.prisma             User, Request, Match models
```

## 💡 QUICK ANSWERS

| Question | Answer |
|----------|--------|
| Add UI component? | `client/src/components/` (Boundary) |
| Add API call? | `client/src/services/` (Boundary) |
| Change business logic? | `server/src/controllers/` (Control) |
| Add API endpoint? | `server/src/routes/` (Control) |
| Add database field? | `server/prisma/schema.prisma` (Entity) |
| Fix login UI? | `LoginPage.tsx` (Boundary) |
| Fix login logic? | `auth.controller.ts` (Control) |
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
╔═══════════════════════════════════════════════╗
║  WHO?    →  BOUNDARY  →  client/ (Frontend)  ║
║   HOW?   →  CONTROL   →  server/ (Backend)   ║
║  WHAT?   →  ENTITY    →  prisma/ (Database)  ║
╚═══════════════════════════════════════════════╝

Classical BCE (Jacobson): Frontend → Backend → Database
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

