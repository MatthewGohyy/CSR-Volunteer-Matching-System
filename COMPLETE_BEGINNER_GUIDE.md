# 🎓 Complete Beginner's Guide to Understanding This Codebase

> **For someone who doesn't understand the structure yet - we'll build your knowledge step by step!**

---

## 📚 Table of Contents
1. [Why Server and Client are Separate](#1-why-server-and-client-are-separate)
2. [Understanding BCE Framework](#2-understanding-bce-framework)
3. [Client Folder Structure Explained](#3-client-folder-structure-explained)
4. [Server Folder Structure Explained](#4-server-folder-structure-explained)
5. [Complete Login Flow Example](#5-complete-login-flow-example)
6. [How to Add a New Feature](#6-how-to-add-a-new-feature)

---

## 1️⃣ Why Server and Client are Separate

### 🍕 Pizza Shop Analogy

Imagine running a pizza shop:

```
┌─────────────────────────────────────────────┐
│           🍕 PIZZA SHOP SYSTEM              │
└─────────────────────────────────────────────┘

    CLIENT (Frontend)                 SERVER (Backend)
    ================                  ================
    
    🏪 STOREFRONT                     🏭 KITCHEN & STORAGE
    - Menu board                      - Pizza ovens
    - Cashier counter                 - Ingredients storage
    - Dining tables                   - Recipe book
    - Order forms                     - Security system
    
    Location: client/                 Location: server/
    Technology: React                 Technology: Node.js
    Runs in: Web browser              Runs on: Server machine
```

### Why Separate?

1. **Security** 🔒
   - Customer shouldn't see the recipe or access the storage room
   - Server keeps database passwords, secret keys hidden from users
   
2. **Flexibility** 🔄
   - You can redecorate the storefront without changing the kitchen
   - You can update the UI without breaking the database
   
3. **Multiple Access Points** 📱💻
   - Same kitchen can serve: storefront, drive-thru, delivery app
   - Same server can serve: website, mobile app, desktop app

4. **Team Collaboration** 👥
   - One team designs the storefront (frontend developers)
   - Another team manages the kitchen (backend developers)
   - They work independently but communicate clearly

---

## 2️⃣ Understanding BCE Framework

BCE = **Boundary - Control - Entity**

### 🎬 Movie Theater Analogy

```
┌──────────────────────────────────────────────────────┐
│              🎬 YOUR APPLICATION                      │
└──────────────────────────────────────────────────────┘

🚪 BOUNDARY = Box Office (Interface Layer)
   ├── What: Where customers interact with the system
   ├── Where: client/src/components/
   ├── Example: LoginPage.tsx, Dashboard.tsx
   └── Job: Show information, collect user input
         ↓ ↓ ↓

👨‍💼 CONTROL = Manager (Business Logic Layer)
   ├── What: Decides what happens and how
   ├── Where: server/src/controllers/
   ├── Example: auth.controller.ts, request.controller.ts
   └── Job: Process requests, enforce rules, coordinate
         ↓ ↓ ↓

📦 ENTITY = Archive Room (Data Storage Layer)
   ├── What: Where all information is stored
   ├── Where: server/prisma/schema.prisma
   ├── Example: User, Request, Match tables
   └── Job: Store and retrieve data safely
```

### 📊 Real Example: Login

```
USER types email and password
          ↓
┌─────────────────────────────────────────┐
│ 🚪 BOUNDARY (client/components/)        │
│                                         │
│ LoginPage.tsx shows:                    │
│ - Email input field                     │
│ - Password input field                  │
│ - Login button                          │
│                                         │
│ When user clicks "Login":               │
│ → authService.login(email, password)    │
└─────────────────────────────────────────┘
          ↓ (HTTP POST request)
┌─────────────────────────────────────────┐
│ 👨‍💼 CONTROL (server/controllers/)        │
│                                         │
│ auth.controller.ts receives:            │
│ 1. Find user by email                   │
│ 2. Check if user exists                 │
│ 3. Check if account is active           │
│ 4. Verify password (hash comparison)    │
│ 5. Generate JWT token                   │
│ 6. Send response back                   │
└─────────────────────────────────────────┘
          ↓ (Database query)
┌─────────────────────────────────────────┐
│ 📦 ENTITY (server/prisma/)              │
│                                         │
│ schema.prisma defines:                  │
│ model User {                            │
│   id        String                      │
│   email     String   @unique            │
│   password  String                      │
│   userType  UserType                    │
│   status    UserStatus                  │
│ }                                       │
└─────────────────────────────────────────┘
          ↓ (Result)
Response flows back up the chain to show dashboard
```

---

## 3️⃣ Client Folder Structure Explained

The **client/** folder contains everything users see and interact with.

### 📁 Directory Map

```
client/
├── public/                    # Static files (don't change)
│   ├── index.html            # Main HTML file (entry point)
│   └── manifest.json         # App metadata
│
├── src/                      # Source code (your work area)
│   │
│   ├── components/              # 🎨 User Interface Components (with API calls)
│   │   ├── LoginPage.tsx       # Login screen (makes auth API calls)
│   │   ├── AdminDashboard.tsx  # Admin panel (makes admin API calls)
│   │   ├── PINDashboard.tsx    # PIN dashboard
│   │   ├── CSRRepDashboard.tsx # CSR Rep dashboard
│   │   ├── PlatformManagerDashboard.tsx # PM dashboard
│   │   ├── CreateUserModal.tsx # User creation form
│   │   └── UserDetailsModal.tsx# User details
│   │
│   ├── config/               # ⚙️ Configuration
│   │   └── api.ts            # Axios instance with interceptors
│   │
│   ├── types/                # 📝 TypeScript Types (Data structures)
│   │   └── index.ts          # Defines User, Request, etc.
│   │
│   ├── App.tsx               # 🏠 Main App Component
│   ├── index.tsx             # 🚀 Entry Point (starts everything)
│   └── index.css             # 🎨 Global Styles
│
└── package.json              # 📦 Dependencies list
```

### 🔍 What Each Folder Does

#### 📂 `components/` - UI Building Blocks

Think of these like LEGO blocks that build your interface:

```typescript
// LoginPage.tsx - A complete login screen
- Shows email input
- Shows password input
- Shows login button
- Handles form validation
- Calls authService when user clicks login
```

**Real code snippet:**
```typescript
// When user clicks login button:
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  loginMutation.mutate(formData); // Sends to backend
};
```

#### 📂 `config/api.ts` - API Configuration

This file configures Axios for all API calls. Components import this and make direct API calls:

```typescript
// config/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**How components use it:**
```typescript
// In LoginPage.tsx
import api from '../config/api';

const response = await api.post('/auth/login', { email, password });
```

#### 📂 `types/` - Data Blueprints

Defines what your data looks like:

```typescript
// types/index.ts
export interface User {
  id: string;
  email: string;
  userType: 'PIN' | 'CSR_REP' | 'USER_ADMIN' | 'PLATFORM_MANAGER';
}

export interface LoginCredentials {
  email: string;
  password: string;
}
```

This ensures you don't accidentally send wrong data!

---

## 4️⃣ Server Folder Structure Explained

The **server/** folder is where the real work happens (backend).

### 📁 Directory Map

```
server/
├── prisma/                   # 💾 Database Layer
│   ├── schema.prisma         # Database structure definition
│   ├── seed.ts               # Sample data generator
│   └── migrations/           # Database version history
│
├── src/                      # Source code
│   │
│   ├── routes/               # 🛣️ API Endpoints (URLs)
│   │   ├── auth.ts           # /api/auth/*
│   │   ├── opportunities.ts  # /api/opportunities/*
│   │   ├── admin.ts          # /api/admin/*
│   │   └── matches.ts        # /api/matches/*
│   │
│   ├── controllers/          # 🎮 Business Logic (What to do)
│   │   ├── auth.controller.ts    # Login/register logic
│   │   ├── request.controller.ts # Request management
│   │   ├── admin.controller.ts   # Admin operations
│   │   └── match.controller.ts   # Matching algorithm
│   │
│   ├── middleware/           # 🛡️ Security & Validation
│   │   ├── auth.ts           # Check if user is logged in
│   │   ├── validation.ts     # Validate input data
│   │   └── errorHandler.ts   # Handle errors gracefully
│   │
│   ├── utils/                # 🔧 Helper Functions
│   │   ├── jwt.ts            # Create/verify tokens
│   │   └── password.ts       # Hash/compare passwords
│   │
│   ├── config/               # ⚙️ Configuration
│   │   └── database.ts       # Database connection
│   │
│   └── server.ts             # 🚀 Main Server File
│
└── package.json              # 📦 Dependencies
```

### 🔍 What Each Folder Does

#### 📂 `routes/` - The Menu (API Endpoints)

Routes define **where** clients can send requests:

```typescript
// routes/auth.ts
import express from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = express.Router();

// Define endpoints:
router.post('/login', AuthController.login);           // POST /api/auth/login
router.post('/register/pin', AuthController.registerPIN); // POST /api/auth/register/pin
router.get('/profile', authenticate, AuthController.getProfile); // GET /api/auth/profile

export default router;
```

**Think of it as a menu:**
- `POST /login` → "I want to log in"
- `POST /register/pin` → "I want to create a PIN account"
- `GET /profile` → "Show me my profile"

#### 📂 `controllers/` - The Chef (Business Logic)

Controllers contain the **HOW** - the actual logic:

```typescript
// controllers/auth.controller.ts
export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    // Step 1: Find user in database
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    // Step 2: Check if user exists
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Step 3: Check if account is active
    if (user.status !== 'ACTIVE') {
      throw new Error('Account is not active');
    }
    
    // Step 4: Verify password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }
    
    // Step 5: Generate token
    const token = generateToken({ userId: user.id });
    
    // Step 6: Send response
    res.json({ user, token });
  }
}
```

**What it does:**
1. Receives email and password
2. Checks database for user
3. Verifies password
4. Creates secure token
5. Sends back to client

#### 📂 `middleware/` - Security Guards

Middleware runs **before** controllers to check permissions:

```typescript
// middleware/auth.ts
export const authenticate = async (req, res, next) => {
  // Get token from request header
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    // Verify token is valid
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user info to request
    next(); // Allow to proceed
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

**Use case:** Protect routes that require login

```typescript
// Only logged-in users can access:
router.get('/profile', authenticate, AuthController.getProfile);
```

#### 📂 `prisma/` - Database Blueprint

Defines your data structure:

```prisma
// schema.prisma
model User {
  id        String      @id @default(uuid())
  email     String      @unique
  password  String
  userType  UserType
  status    UserStatus  @default(ACTIVE)
  createdAt DateTime    @default(now())
  
  // Relations
  pin            PIN?
  csrRep         CSRRep?
  platformManager PlatformManager?
}

model Request {
  id          String   @id @default(uuid())
  title       String
  description String
  status      String
  pinId       String
  
  pin         PIN      @relation(fields: [pinId], references: [id])
}
```

**This creates tables in your database!**

---

## 5️⃣ Complete Login Flow Example

Let's trace a **complete login** from start to finish:

### 📍 Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: User enters email and password                      │
│ Location: Browser                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: LoginPage.tsx component                             │
│ File: client/src/components/LoginPage.tsx                   │
│                                                             │
│ const handleSubmit = () => {                                │
│   loginMutation.mutate(formData);                           │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: LoginPage makes API call with React Query           │
│ File: client/src/components/LoginPage.tsx                   │
│                                                             │
│ import api from '../config/api';                            │
│                                                             │
│ const loginMutation = useMutation({                         │
│   mutationFn: async (credentials) => {                      │
│     const response = await api.post('/auth/login', credentials);│
│     return response.data;                                   │
│   }                                                         │
│ });                                                         │
│                                                             │
│ Sends to: http://localhost:4000/api/auth/login              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Server receives request                             │
│ File: server/src/server.ts                                  │
│                                                             │
│ app.use('/api/auth', authRoutes);                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Route directs to controller                         │
│ File: server/src/routes/auth.ts                             │
│                                                             │
│ router.post('/login', AuthController.login);                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Controller processes login                          │
│ File: server/src/controllers/auth.controller.ts             │
│                                                             │
│ 1. Find user by email in database                           │
│ 2. Check if user exists                                     │
│ 3. Check if account is active                               │
│ 4. Verify password                                          │
│ 5. Generate JWT token                                       │
│ 6. Return { user, token }                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: Database query                                      │
│ File: server/prisma/schema.prisma                           │
│                                                             │
│ const user = await prisma.user.findUnique({                 │
│   where: { email: 'user@example.com' }                      │
│ });                                                         │
│                                                             │
│ Returns: User object from PostgreSQL                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 8: Response sent back to client                        │
│                                                             │
│ res.json({                                                  │
│   user: { id, email, userType },                            │
│   token: 'eyJhbGciOiJIUzI1NiIsInR5...'                      │
│ });                                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 9: LoginPage receives response and stores data        │
│ File: client/src/components/LoginPage.tsx                   │
│                                                             │
│ onSuccess: (data) => {                                      │
│   localStorage.setItem('token', data.token);                │
│   localStorage.setItem('user', JSON.stringify(data.user));  │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 10: LoginPage navigates to dashboard                   │
│ File: client/src/components/LoginPage.tsx                   │
│                                                             │
│ onSuccess: (data) => {                                      │
│   if (data.user.userType === 'PIN') {                       │
│     navigate('/pin/dashboard');                             │
│   }                                                         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 11: User sees their dashboard! ✅                       │
└─────────────────────────────────────────────────────────────┘
```

### 🔑 Key Files Involved

| File | Purpose | Code Example |
|------|---------|--------------|
| `LoginPage.tsx` | UI Form | `<input type="email" />` |
| `authService.ts` | API Call | `api.post('/auth/login', data)` |
| `auth.ts` (routes) | URL Mapping | `router.post('/login', ...)` |
| `auth.controller.ts` | Business Logic | `prisma.user.findUnique(...)` |
| `schema.prisma` | Database Model | `model User { ... }` |

---

## 6️⃣ How to Add a New Feature

Let's say you want to add **"View Request Details"** feature.

### 🎯 Step-by-Step Process

#### **Step 1: Define Database Model (ENTITY)**

```prisma
// server/prisma/schema.prisma
model Request {
  id          String   @id @default(uuid())
  title       String
  description String
  status      String
  views       Int      @default(0)  // ← NEW FIELD
  pinId       String
  
  pin         PIN      @relation(fields: [pinId], references: [id])
}
```

Run: `npx prisma migrate dev --name add_views_to_request`

---

#### **Step 2: Create Controller Logic (CONTROL)**

```typescript
// server/src/controllers/request.controller.ts
export class RequestController {
  static async getRequestDetails(req: Request, res: Response) {
    const { id } = req.params;
    
    // Increment view count
    const request = await prisma.request.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: { 
        pin: true,
        category: true 
      }
    });
    
    res.json({ request });
  }
}
```

---

#### **Step 3: Create Route (BOUNDARY - Backend)**

```typescript
// server/src/routes/opportunities.ts
router.get('/:id', 
  authenticate,                              // Check if logged in
  RequestController.getRequestDetails        // Handle request
);
```

This creates: `GET /api/opportunities/:id`

---

#### **Step 4: Create UI Component (BOUNDARY - Frontend)**

```typescript
// client/src/components/RequestDetailsPage.tsx
import { useQuery } from '@tanstack/react-query';
import api from '../config/api';
import { useParams } from 'react-router-dom';

export const RequestDetailsPage = () => {
  const { id } = useParams();
  
  // Direct API call with React Query
  const { data: request, isLoading } = useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      const response = await api.get(`/opportunities/${id}`);
      return response.data.request;
    }
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{request?.title}</h1>
      <p>{request?.description}</p>
      <p>Views: {request?.viewCount}</p>
    </div>
  );
};
```

---

### ✅ Summary of Changes

| Layer | File | What Changed |
|-------|------|--------------|
| **ENTITY** | `schema.prisma` | Added `views` field |
| **CONTROL** | `request.controller.ts` | Created `getRequestDetails` logic |
| **BOUNDARY (API)** | `opportunities.ts` | Added `GET /:id` route |
| **BOUNDARY (Service)** | `requestService.ts` | Created `getRequestDetails` function |
| **BOUNDARY (UI)** | `RequestDetailsPage.tsx` | Created display component |

---

## 🎯 Quick Reference Cheat Sheet

### Where to Find Things

| I want to... | Look in... | File Example |
|--------------|-----------|--------------|
| **Change the UI** | `client/src/components/` | `LoginPage.tsx` |
| **Add API call to component** | `client/src/components/` | Use `api` from `config/api.ts` |
| **Configure Axios** | `client/src/config/` | `api.ts` |
| **Add new endpoint** | `server/src/routes/` | `auth.ts` |
| **Add business logic** | `server/src/controllers/` | `auth.controller.ts` |
| **Change database** | `server/prisma/` | `schema.prisma` |
| **Add security check** | `server/src/middleware/` | `auth.ts` |
| **Add helper function** | `server/src/utils/` | `password.ts` |

### Common Patterns

```typescript
// Pattern 1: Making an API call (Frontend)
const response = await api.post('/endpoint', data);

// Pattern 2: Defining a route (Backend)
router.post('/endpoint', middleware, Controller.method);

// Pattern 3: Controller method (Backend)
static async method(req: Request, res: Response) {
  const data = req.body;
  const result = await prisma.model.create({ data });
  res.json({ result });
}

// Pattern 4: Database query (Backend)
const user = await prisma.user.findUnique({
  where: { id: userId }
});
```

---

## 🚀 How to Run the Project

### Terminal 1: Start Database
```bash
docker-compose up -d
```

### Terminal 2: Start Backend Server
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Terminal 3: Start Frontend
```bash
cd client
npm install
npm start
```

### Access Points
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:4000
- 🗄️ Database UI: http://localhost:5050 (pgAdmin)

---

## 📝 Key Takeaways

1. **Client/Server Separation**
   - Client = What users see (browser)
   - Server = Where logic happens (backend)

2. **BCE Architecture**
   - Boundary = Interface (UI + API endpoints)
   - Control = Logic (controllers)
   - Entity = Data (database)

3. **Data Flow**
   ```
   User → UI Component → API call → Route → Controller → Database
                                              ↓
   User ← UI Component ← Response ← Route ← Result
   ```

4. **Folder Purposes**
   - `components/` = UI pieces (with API calls)
   - `config/` = API configuration (axios)
   - `routes/` = URL endpoints (backend)
   - `controllers/` = Business logic (backend)
   - `middleware/` = Security/validation (backend)
   - `prisma/` = Database structure (backend)

---

## 🎓 Practice Exercise

Try to trace this user story: **"As a PIN, I want to create a request"**

1. Which component shows the form? → `?`
2. Which service sends the data? → `?`
3. Which route receives it? → `?`
4. Which controller processes it? → `?`
5. Which database model stores it? → `?`

<details>
<summary>Click to see answer</summary>

1. Component: `PINDashboard.tsx` or request form component (in `client/src/components/`)
2. API Call: Component uses `api.post('/opportunities', data)` with React Query
3. Route: `POST /api/opportunities` (in `server/src/routes/opportunities.ts`)
4. Controller: `RequestController.createRequest()` (in `server/src/controllers/`)
5. Model: `Request` (in `server/prisma/schema.prisma`)

</details>

---

## 💡 Next Steps

1. ✅ Read this guide completely
2. ✅ Run the project locally
3. ✅ Open the files mentioned and see the actual code
4. ✅ Try to trace one user story from UI to database
5. ✅ Make a small change and see it work!

---

**🎉 You now understand the codebase structure! Time to build something awesome!**

For more details:
- See `BCE_SIMPLE_GUIDE.md` for BCE framework
- See `API_DOCUMENTATION.md` for all endpoints
- See `START_STOP_GUIDE.md` for running the app

