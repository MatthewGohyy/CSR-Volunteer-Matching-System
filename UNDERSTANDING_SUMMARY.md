# 📚 Understanding the Codebase - Quick Summary

> **Everything you need to know in one place**

---

## 🎯 The Big Picture (30 Second Overview)

```
Your application has 3 main parts:

1. CLIENT (Frontend)  → What users see in their browser
   Location: client/
   Tech: React + TypeScript
   
2. SERVER (Backend)   → Where the logic and security lives  
   Location: server/
   Tech: Node.js + Express + Prisma
   
3. DATABASE          → Where data is stored
   Tech: PostgreSQL (in Docker)
```

**They communicate:** Client ←HTTP JSON→ Server ←SQL→ Database

---

## 🏗️ Why is Client and Server Separate?

Think of it like a **restaurant**:

| Part | Restaurant | Your App | Why Separate? |
|------|------------|----------|---------------|
| **Client** | Dining area | Frontend UI | Users see this, it's pretty but not secure |
| **Server** | Kitchen | Backend logic | Hidden from users, handles sensitive stuff |
| **Database** | Storage room | PostgreSQL | Most secure, only server can access |

**Benefits:**
- 🔒 Security: Users can't access database directly
- 🔄 Flexibility: Change UI without breaking backend
- 📱 Multiple access: Same backend for web, mobile, etc.

---

## 🎓 Understanding BCE Framework

BCE = **Boundary - Control - Entity**

### The Simple Version

```
🚪 BOUNDARY = Interface
   ↓ What: Where users/systems interact
   ↓ Frontend: Components (LoginPage.tsx)
   ↓ Backend: Routes (auth.ts)
   
👨‍💼 CONTROL = Logic
   ↓ What: Business rules and processing
   ↓ Location: Controllers (auth.controller.ts)
   ↓ Also: Middleware, Utils
   
📦 ENTITY = Data
   ↓ What: Data storage and structure
   ↓ Location: Prisma schema (schema.prisma)
   ↓ Result: Database tables
```

### The Login Example

```
User enters email/password (UI)
      ↓ BOUNDARY
LoginPage.tsx → authService.ts → HTTP Request
      ↓ BOUNDARY  
routes/auth.ts receives request
      ↓ CONTROL
auth.controller.ts processes:
  • Find user
  • Check password
  • Generate token
      ↓ ENTITY
Prisma queries PostgreSQL
      ↓ CONTROL
Response created
      ↓ BOUNDARY
Response sent to client
      ↓ BOUNDARY
UI updates (show dashboard)
```

---

## 📂 Client Folder Structure (Frontend)

```
client/
│
├── src/
│   ├── components/          ← 🎨 What users see
│   │   ├── LoginPage.tsx    → Login screen
│   │   ├── Dashboard.tsx    → Main dashboard
│   │   └── ...              → More UI components
│   │
│   ├── services/            ← 🔌 Talk to backend
│   │   ├── authService.ts   → Login, register
│   │   ├── requestService.ts→ Manage requests
│   │   └── ...              → API calls
│   │
│   ├── types/               ← 📝 Data structures
│   │   └── index.ts         → TypeScript types
│   │
│   ├── config/              ← ⚙️ Settings
│   │   └── api.ts           → API configuration
│   │
│   ├── App.tsx              ← 🏠 Main app
│   └── index.tsx            ← 🚀 Entry point
│
└── public/                  ← 📁 Static files
    └── index.html
```

### What Each Does

| Folder | Purpose | Example |
|--------|---------|---------|
| `components/` | UI pieces | Login form, buttons, cards |
| `services/` | API calls | Send data to backend |
| `types/` | Data shapes | What a User looks like |
| `config/` | Settings | API URL, headers |

---

## 📂 Server Folder Structure (Backend)

```
server/
│
├── src/
│   ├── routes/              ← 🛣️ API URLs
│   │   ├── auth.ts          → /api/auth/*
│   │   ├── opportunities.ts → /api/opportunities/*
│   │   └── ...              → More endpoints
│   │
│   ├── controllers/         ← 🎮 Business logic
│   │   ├── auth.controller.ts    → Login logic
│   │   ├── request.controller.ts → Request CRUD
│   │   └── ...                   → More logic
│   │
│   ├── middleware/          ← 🛡️ Security
│   │   ├── auth.ts          → Check if logged in
│   │   ├── validation.ts    → Validate input
│   │   └── errorHandler.ts  → Handle errors
│   │
│   ├── utils/               ← 🔧 Helpers
│   │   ├── jwt.ts           → Token handling
│   │   └── password.ts      → Password hashing
│   │
│   ├── config/              ← ⚙️ Configuration
│   │   └── database.ts      → DB connection
│   │
│   └── server.ts            ← 🚀 Main file
│
└── prisma/
    ├── schema.prisma        ← 💾 Database schema
    ├── seed.ts              ← 🌱 Sample data
    └── migrations/          ← 📜 DB history
```

### What Each Does

| Folder | Purpose | Example |
|--------|---------|---------|
| `routes/` | Define URLs | POST /api/auth/login |
| `controllers/` | Main logic | Verify password, create user |
| `middleware/` | Pre-checks | Is user logged in? Is data valid? |
| `utils/` | Helper functions | Hash password, create token |
| `prisma/` | Database | Tables, relationships |

---

## 🔄 How Data Flows (Complete Journey)

### Example: User Creates a Request

```
STEP 1: UI
┌─────────────────────────────────┐
│ CreateRequestForm.tsx           │
│ User fills:                     │
│ - Title                         │
│ - Description                   │
│ - Category                      │
│ Clicks [Submit]                 │
└─────────────────────────────────┘
           ↓
STEP 2: Service
┌─────────────────────────────────┐
│ requestService.ts               │
│ createRequest(data)             │
│                                 │
│ POST /api/opportunities         │
│ Headers: { Authorization }      │
│ Body: { title, description }    │
└─────────────────────────────────┘
           ↓
STEP 3: Route
┌─────────────────────────────────┐
│ routes/opportunities.ts         │
│                                 │
│ router.post('/',                │
│   authenticate,    ← Check login│
│   authorize(['PIN']), ← Check role│
│   validateRequest, ← Check data │
│   Controller.create             │
│ )                               │
└─────────────────────────────────┘
           ↓
STEP 4: Middleware
┌─────────────────────────────────┐
│ authenticate() runs:            │
│ ✓ Get token from header         │
│ ✓ Verify token                  │
│ ✓ Attach user to req.user       │
│                                 │
│ authorize(['PIN']) runs:        │
│ ✓ Check if user.type === 'PIN'  │
│                                 │
│ validateRequest() runs:         │
│ ✓ Check title length            │
│ ✓ Check description exists      │
└─────────────────────────────────┘
           ↓
STEP 5: Controller
┌─────────────────────────────────┐
│ request.controller.ts           │
│                                 │
│ createRequest() {               │
│   const data = req.body;        │
│   const pinId = req.user.pinId; │
│                                 │
│   const request =               │
│     await prisma.request.create(│
│       { data }                  │
│     );                          │
│                                 │
│   res.json({ request });        │
│ }                               │
└─────────────────────────────────┘
           ↓
STEP 6: Database
┌─────────────────────────────────┐
│ Prisma → PostgreSQL             │
│                                 │
│ INSERT INTO "Request"           │
│ (id, title, description, pinId) │
│ VALUES (...)                    │
│                                 │
│ Returns: created request object │
└─────────────────────────────────┘
           ↓
STEP 7: Response
┌─────────────────────────────────┐
│ JSON response:                  │
│ {                               │
│   request: {                    │
│     id: "123",                  │
│     title: "Need food",         │
│     status: "ACTIVE"            │
│   }                             │
│ }                               │
└─────────────────────────────────┘
           ↓
STEP 8: UI Update
┌─────────────────────────────────┐
│ requestService receives data    │
│ → Updates UI state              │
│ → Shows success message         │
│ → Navigates to requests list    │
└─────────────────────────────────┘
```

---

## 🔐 How Authentication Works

### Login Process

```
1. User enters email + password
2. authService sends to /api/auth/login
3. Controller checks:
   ✓ User exists?
   ✓ Password correct?
   ✓ Account active?
4. Generate JWT token
5. Send { user, token } back
6. Frontend stores in localStorage
```

### Protected Requests

```
Every request after login includes:

Headers: {
  Authorization: "Bearer eyJhbGciOiJIUz..."
}

Middleware verifies:
1. Token exists?
2. Token valid?
3. Not expired?
4. User has permission?

If yes → Allow request
If no → Return 401 Unauthorized
```

---

## 📊 Database Structure (Key Models)

```
User (Account)
├── id
├── email
├── password (hashed)
├── userType (PIN, CSR_REP, etc.)
└── status (ACTIVE, SUSPENDED)
    │
    ├──→ PIN (if userType = PIN)
    │    ├── name
    │    ├── age
    │    └── location
    │
    ├──→ CSRRep (if userType = CSR_REP)
    │    ├── companyName
    │    └── industry
    │
    └──→ PlatformManager (if userType = PLATFORM_MANAGER)
         └── department

Request (Help needed)
├── id
├── title
├── description
├── status (ACTIVE, FULFILLED, etc.)
├── pinId → links to PIN
└── categoryId → links to Category

Match (PIN ↔ CSR connection)
├── id
├── requestId → links to Request
├── csrRepId → links to CSRRep
└── status (PENDING, ACCEPTED, etc.)
```

---

## 🛠️ Common Tasks & Where to Look

### I want to...

| Task | Location | Files |
|------|----------|-------|
| **Add new UI page** | `client/src/components/` | Create `NewPage.tsx` |
| **Add API endpoint** | `server/src/routes/` | Add to appropriate route file |
| **Add business logic** | `server/src/controllers/` | Create/update controller |
| **Change database** | `server/prisma/schema.prisma` | Update model, run migration |
| **Add validation** | `server/src/validators/` | Create validation rules |
| **Fix authentication** | `server/src/middleware/auth.ts` | Update auth middleware |
| **Add helper function** | `server/src/utils/` | Create utility file |

### Debugging Checklist

1. **Frontend error?**
   - Check browser console
   - Check Network tab
   - Verify service is called correctly

2. **Backend error?**
   - Check server terminal
   - Check route is defined
   - Verify controller logic

3. **Database error?**
   - Run `npx prisma generate`
   - Check migration applied
   - Verify field names match

---

## 🚀 Running the Project

### Quick Start

```bash
# Terminal 1: Database
docker-compose up -d

# Terminal 2: Backend
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Terminal 3: Frontend
cd client
npm install
npm start
```

### Access Points

- 🌐 Frontend: http://localhost:3000
- 🔌 API: http://localhost:4000
- 📊 Prisma Studio: `npx prisma studio` (in server/)
- 🗄️ pgAdmin: http://localhost:5050

---

## 📝 Code Patterns You'll See

### Pattern 1: API Call (Frontend)

```typescript
// In service file
export const someService = {
  getSomething: async () => {
    const response = await api.get('/endpoint');
    return response.data;
  }
};

// In component
const { data } = useQuery({
  queryKey: ['something'],
  queryFn: someService.getSomething
});
```

### Pattern 2: Route Definition (Backend)

```typescript
router.post('/endpoint',
  authenticate,           // Check logged in
  authorize(['ROLE']),    // Check permission
  validateRequest(rules), // Validate data
  Controller.method       // Handle request
);
```

### Pattern 3: Controller (Backend)

```typescript
static async method(req: Request, res: Response) {
  const data = req.body;
  const userId = req.user.userId;
  
  const result = await prisma.model.create({
    data: { ...data, userId }
  });
  
  res.json({ result });
}
```

### Pattern 4: Database Query (Backend)

```typescript
// Create
const user = await prisma.user.create({
  data: { email, password }
});

// Read
const users = await prisma.user.findMany({
  where: { status: 'ACTIVE' }
});

// Update
const user = await prisma.user.update({
  where: { id },
  data: { name: 'New Name' }
});

// Delete (usually soft delete)
const user = await prisma.user.update({
  where: { id },
  data: { status: 'DELETED' }
});
```

---

## 🎯 Learning Path

### Step 1: Understand Structure (30 min)
- ✅ Read this summary
- ✅ Look at folder structure
- ✅ Understand why client/server separate

### Step 2: Trace a Feature (1 hour)
- ✅ Pick login flow
- ✅ Follow from UI to database
- ✅ Understand each step

### Step 3: Make Small Changes (2 hours)
- ✅ Add a field to UI
- ✅ Update database schema
- ✅ Modify controller logic
- ✅ Test changes

### Step 4: Build New Feature (4 hours)
- ✅ Plan the feature
- ✅ Update database (Entity)
- ✅ Create controller (Control)
- ✅ Add routes (Boundary)
- ✅ Build UI (Boundary)
- ✅ Test thoroughly

---

## 📚 Additional Resources

### Documentation Files (In Order)

1. **COMPLETE_BEGINNER_GUIDE.md** ← Start here
   - Detailed explanation of everything
   - Analogies and examples

2. **VISUAL_ARCHITECTURE.md**
   - Diagrams and flowcharts
   - Visual representation

3. **HANDS_ON_EXPLORATION.md** ← You are here!
   - Practical exercises
   - Step-by-step tracing

4. **BCE_SIMPLE_GUIDE.md**
   - Deep dive into BCE
   - Academic interpretation

5. **API_DOCUMENTATION.md**
   - All API endpoints
   - Request/response formats

6. **CLASS_DIAGRAMS.md**
   - Database relationships
   - Data models

### Key Files to Understand

**Frontend:**
- `client/src/App.tsx` - Main app structure
- `client/src/components/LoginPage.tsx` - Example component
- `client/src/services/authService.ts` - Example service

**Backend:**
- `server/src/server.ts` - Server setup
- `server/src/routes/auth.ts` - Example routes
- `server/src/controllers/auth.controller.ts` - Example logic
- `server/src/middleware/auth.ts` - Authentication
- `server/prisma/schema.prisma` - Database schema

---

## 💡 Key Takeaways

1. **Client/Server Separation**
   - Client = UI in browser
   - Server = Logic + security
   - Database = Data storage

2. **BCE Architecture**
   - Boundary = Interfaces (UI + API)
   - Control = Logic (Controllers + Middleware)
   - Entity = Data (Database schema)

3. **Data Flow**
   - Always: UI → Service → Route → Middleware → Controller → Database
   - Then back: Database → Controller → Route → Service → UI

4. **Authentication**
   - Login generates JWT token
   - Token stored in localStorage
   - Sent with every request
   - Middleware verifies token

5. **File Organization**
   - Frontend: components, services, types
   - Backend: routes, controllers, middleware, utils
   - Database: Prisma schema

---

## 🎓 You're Ready!

You now understand:
- ✅ Why client and server are separate
- ✅ What BCE framework means
- ✅ How data flows through the system
- ✅ Where to find and change things
- ✅ How authentication works
- ✅ Common code patterns

**Next steps:**
1. Pick a user story from requirements
2. Trace similar existing features
3. Implement following BCE pattern
4. Test and get code review

**Remember:** When stuck, trace the flow. The pattern is always the same!

---

**📞 Need Help?**

- Read detailed docs in the files listed above
- Trace existing features to understand patterns
- Ask your team when really stuck
- Use the debugging checklist

**Happy Coding! 🚀**

