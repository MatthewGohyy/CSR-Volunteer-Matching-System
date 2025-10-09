# 🏗️ BCE Architecture Explained - CSR Platform

## 📚 What is BCE?

**BCE = Boundary-Control-Entity**

It's a software architecture pattern that separates your application into three clear layers:
- **B**oundary - Handles communication with the outside world
- **C**ontrol - Contains business logic and coordinates operations
- **E**ntity - Represents data and database models

Think of it like a restaurant:
- 🚪 **Boundary** = Waiters (take orders, serve food)
- 👨‍🍳 **Control** = Chefs (prepare the food, follow recipes)
- 📦 **Entity** = Ingredients & Recipes (the actual data)

---

## 🎯 How BCE is Implemented in Your Project

### **Architecture Overview:**

```
CLIENT REQUEST
      ↓
📍 BOUNDARY LAYER (Routes)
      ↓
🎮 CONTROL LAYER (Controllers + Middleware)
      ↓
📦 ENTITY LAYER (Prisma Models + Database)
      ↓
DATABASE
```

---

## 🔵 **1. BOUNDARY Layer** (Routes)

**What:** Entry points for external requests  
**Where:** `server/src/routes/`  
**Purpose:** Define API endpoints and route requests to controllers

### **Files:**
```
routes/
├── auth.ts           # Authentication endpoints
├── opportunities.ts  # Request/opportunity endpoints
├── volunteers.ts     # PIN endpoints
├── organizations.ts  # CSR Rep endpoints
└── matches.ts        # Match endpoints
```

### **Example - auth.ts:**
```typescript
// BOUNDARY: Defines API endpoints
router.post('/register/pin', 
  validateRequest(pinRegistrationRules),  // Validation
  AuthController.registerPIN              // Route to controller
);

router.post('/login', 
  validateRequest(loginRules),
  AuthController.login
);
```

**What it does:**
- ✅ Defines URL paths (`/api/auth/login`)
- ✅ Applies validation rules
- ✅ Routes to appropriate controller method
- ✅ Handles HTTP methods (GET, POST, PUT, DELETE)

---

## 🟢 **2. CONTROL Layer** (Controllers + Middleware)

**What:** Business logic and coordination  
**Where:** `server/src/controllers/` and `server/src/middleware/`  
**Purpose:** Process requests, apply business rules, orchestrate operations

### **Controllers:**
```
controllers/
├── auth.controller.ts     # Authentication logic
├── request.controller.ts  # Request management logic
├── pin.controller.ts      # PIN-specific logic
├── csrRep.controller.ts   # CSR Rep-specific logic
└── match.controller.ts    # Matching logic
```

### **Example - auth.controller.ts:**
```typescript
// CONTROL: Business logic for registration
static async registerPIN(req: Request, res: Response) {
  // 1. Extract data from request
  const { email, password, name, age, location } = req.body;
  
  // 2. Business rules
  const existingUser = await prisma.user.findUnique({ 
    where: { email } 
  });
  
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }
  
  // 3. Process data
  const hashedPassword = await hashPassword(password);
  
  // 4. Coordinate with Entity layer
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      userType: 'PIN',
      pin: {
        create: { name, age, location }
      }
    }
  });
  
  // 5. Generate response
  const token = generateToken({...});
  
  // 6. Send response
  res.status(201).json({ user, token });
}
```

**What it does:**
- ✅ Validates business rules
- ✅ Processes data
- ✅ Coordinates between layers
- ✅ Handles errors
- ✅ Formats responses

### **Middleware:**
```
middleware/
├── auth.ts           # JWT authentication
├── validation.ts     # Input validation
└── errorHandler.ts   # Error handling
```

**Example - auth.ts middleware:**
```typescript
// CONTROL: Authentication logic
export const authenticate = async (req, res, next) => {
  // 1. Extract token
  const token = req.headers.authorization?.split(' ')[1];
  
  // 2. Verify token
  const decoded = verifyToken(token);
  
  // 3. Attach user to request
  req.user = decoded;
  
  // 4. Continue to next handler
  next();
};
```

---

## 🟣 **3. ENTITY Layer** (Prisma Models)

**What:** Data structures and database models  
**Where:** `server/prisma/schema.prisma`  
**Purpose:** Define how data is structured and stored

### **Prisma Schema (Entities):**
```prisma
// ENTITY: User data model
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  userType  UserType
  status    UserStatus @default(ACTIVE)
  createdAt DateTime @default(now())
  
  // Relations
  pin       PIN?
  csrRep    CSRRep?
}

// ENTITY: PIN (Person In Need) data model
model PIN {
  id                String  @id @default(uuid())
  userId            String  @unique
  name              String
  age               Int?
  location          String?
  phoneNumber       String?
  
  // Relations
  user              User     @relation(...)
  requests          Request[]
  matches           Match[]
}

// ENTITY: Request data model
model Request {
  id          String        @id @default(uuid())
  pinId       String
  categoryId  String
  title       String
  description String
  urgency     UrgencyLevel
  status      RequestStatus @default(ACTIVE)
  
  // Relations
  pin         PIN          @relation(...)
  category    ServiceCategory @relation(...)
  offers      VolunteerOffer[]
}
```

**What it does:**
- ✅ Defines data structure (fields, types)
- ✅ Defines relationships (one-to-many, many-to-many)
- ✅ Sets constraints (unique, required)
- ✅ Maps to database tables

---

## 🔄 **Complete Flow Example: User Login**

Let's trace a login request through all BCE layers:

### **1. CLIENT sends request:**
```javascript
POST http://localhost:4000/api/auth/login
Body: { "email": "user@example.com", "password": "pass123" }
```

### **2. BOUNDARY (Routes) receives it:**
```typescript
// routes/auth.ts
router.post('/login',
  validateRequest(loginRules),  // Validate input
  AuthController.login          // Send to controller
);
```

### **3. CONTROL (Controller) processes it:**
```typescript
// controllers/auth.controller.ts
static async login(req, res) {
  const { email, password } = req.body;
  
  // Business logic
  const user = await prisma.user.findUnique({
    where: { email },
    include: { pin: true, csrRep: true }
  });
  
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }
  
  const validPassword = await comparePassword(password, user.password);
  
  if (!validPassword) {
    throw new AppError('Invalid credentials', 401);
  }
  
  const token = generateToken({
    userId: user.id,
    email: user.email,
    userType: user.userType
  });
  
  res.json({ user, token });
}
```

### **4. ENTITY (Prisma) queries database:**
```typescript
// Prisma translates to SQL:
SELECT * FROM "User" 
LEFT JOIN "PIN" ON "User"."id" = "PIN"."userId"
LEFT JOIN "CSRRep" ON "User"."id" = "CSRRep"."userId"
WHERE "email" = 'user@example.com'
```

### **5. Response flows back:**
```
DATABASE → Entity → Control → Boundary → CLIENT
```

---

## 📊 **Your Project Structure (BCE Mapped)**

```
server/src/
│
├── 📍 BOUNDARY LAYER
│   ├── routes/
│   │   ├── auth.ts          # /api/auth/*
│   │   ├── opportunities.ts # /api/opportunities/*
│   │   ├── volunteers.ts    # /api/volunteers/*
│   │   ├── organizations.ts # /api/organizations/*
│   │   └── matches.ts       # /api/matches/*
│   │
│   └── validators/          # Input validation rules
│       ├── auth.validator.ts
│       └── request.validator.ts
│
├── 🎮 CONTROL LAYER
│   ├── controllers/
│   │   ├── auth.controller.ts      # Auth business logic
│   │   ├── request.controller.ts   # Request logic
│   │   ├── pin.controller.ts       # PIN logic
│   │   ├── csrRep.controller.ts    # CSR Rep logic
│   │   └── match.controller.ts     # Match logic
│   │
│   ├── middleware/
│   │   ├── auth.ts          # Authentication
│   │   ├── validation.ts    # Validation
│   │   └── errorHandler.ts  # Error handling
│   │
│   └── utils/               # Helper functions
│       ├── jwt.ts
│       └── password.ts
│
└── 📦 ENTITY LAYER
    ├── prisma/schema.prisma # Data models (outside src/)
    ├── dto/                 # Data Transfer Objects
    └── config/database.ts   # Database connection
```

---

## 🎯 **Why Use BCE?**

### **✅ Advantages:**

1. **Separation of Concerns**
   - Each layer has one job
   - Easy to understand
   - Easy to maintain

2. **Testability**
   - Test each layer independently
   - Mock other layers easily
   - Better code coverage

3. **Flexibility**
   - Change database without changing routes
   - Change API without changing business logic
   - Swap components easily

4. **Team Collaboration**
   - Frontend dev works on Boundary
   - Backend dev works on Control
   - Database dev works on Entity
   - Less conflicts!

5. **Scalability**
   - Add new features easily
   - Extend existing features
   - Minimal impact on other layers

---

## 📝 **Real Examples from Your Code**

### **Example 1: Creating a Request**

**BOUNDARY (routes/opportunities.ts):**
```typescript
router.post('/', 
  authenticate,                    // Middleware
  authorize(['PIN']),              // Middleware
  validateRequest(createRules),    // Validation
  RequestController.createRequest  // Controller
);
```

**CONTROL (controllers/request.controller.ts):**
```typescript
static async createRequest(req, res) {
  const { categoryId, title, description, urgency } = req.body;
  const pinId = req.user.pinId;
  
  // Business logic: Create request
  const request = await prisma.request.create({
    data: {
      pinId,
      categoryId,
      title,
      description,
      urgency,
      status: 'ACTIVE'
    },
    include: { category: true }
  });
  
  res.status(201).json({ request });
}
```

**ENTITY (prisma/schema.prisma):**
```prisma
model Request {
  id          String        @id @default(uuid())
  pinId       String
  categoryId  String
  title       String
  description String
  urgency     UrgencyLevel
  status      RequestStatus @default(ACTIVE)
  createdAt   DateTime      @default(now())
  
  pin         PIN              @relation(...)
  category    ServiceCategory  @relation(...)
}
```

---

### **Example 2: Accepting an Offer**

**BOUNDARY (routes/matches.ts):**
```typescript
router.post('/offers/:id/accept',
  authenticate,
  authorize(['PIN']),
  MatchController.acceptOffer
);
```

**CONTROL (controllers/match.controller.ts):**
```typescript
static async acceptOffer(req, res) {
  const { id: offerId } = req.params;
  
  // Business rules: Check if offer exists
  const offer = await prisma.volunteerOffer.findUnique({
    where: { id: offerId },
    include: { request: true }
  });
  
  if (!offer) {
    throw new AppError('Offer not found', 404);
  }
  
  // Business logic: Create match
  const match = await prisma.match.create({
    data: {
      requestId: offer.requestId,
      csrRepId: offer.csrRepId,
      pinId: offer.request.pinId,
      status: 'ACTIVE',
      matchedAt: new Date()
    }
  });
  
  // Update offer status
  await prisma.volunteerOffer.update({
    where: { id: offerId },
    data: { status: 'ACCEPTED' }
  });
  
  res.json({ match });
}
```

**ENTITY (prisma/schema.prisma):**
```prisma
model Match {
  id          String      @id @default(uuid())
  requestId   String
  csrRepId    String
  pinId       String
  status      MatchStatus @default(ACTIVE)
  matchedAt   DateTime
  
  request     Request  @relation(...)
  csrRep      CSRRep   @relation(...)
  pin         PIN      @relation(...)
}
```

---

## 🔍 **Quick Reference**

### **When you add a new feature:**

1. **ENTITY First** (Define data):
   ```prisma
   // Add to schema.prisma
   model NewFeature {
     id    String @id @default(uuid())
     name  String
     // ...
   }
   ```

2. **CONTROL Second** (Business logic):
   ```typescript
   // Add to controllers/
   static async createFeature(req, res) {
     // Business logic here
   }
   ```

3. **BOUNDARY Last** (API endpoint):
   ```typescript
   // Add to routes/
   router.post('/features', 
     authenticate,
     FeatureController.createFeature
   );
   ```

---

## 🎓 **Summary**

**BCE in Your Project:**

| Layer | What | Where | Example |
|-------|------|-------|---------|
| **Boundary** | API endpoints, routing | `routes/` | `POST /api/auth/login` |
| **Control** | Business logic, coordination | `controllers/`, `middleware/` | Validate user, hash password |
| **Entity** | Data models, database | `prisma/schema.prisma` | User, Request, Match models |

**Flow:**
```
User clicks Login
  ↓
Boundary: Route receives request → routes/auth.ts
  ↓
Control: Validate & process → controllers/auth.controller.ts
  ↓
Entity: Query database → Prisma models
  ↓
Control: Format response
  ↓
Boundary: Send to client
  ↓
User sees dashboard
```

---

## 💡 **Key Takeaway**

**BCE keeps your code organized:**
- 📍 **Boundary** = "What endpoints do we have?"
- 🎮 **Control** = "What rules do we follow?"
- 📦 **Entity** = "What data do we store?"

Each layer talks only to its neighbors, keeping everything clean and maintainable!

---

**Your backend follows BCE perfectly! 🎉**

