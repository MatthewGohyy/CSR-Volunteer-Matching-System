# 🔬 Hands-On Code Exploration Guide

> **Learn by doing! Follow these exercises to understand the codebase**

---

## 🎯 Goal

By the end of this guide, you'll be able to:
- ✅ Trace a feature from UI to database
- ✅ Understand how data flows through the system
- ✅ Know where to look when debugging
- ✅ Add your own simple feature

---

## 📚 Exercise 1: Trace the Login Flow

### Step-by-step investigation

#### 1️⃣ Start with the UI

**Open:** `client/src/components/LoginPage.tsx`

**Find these lines (around line 62-70):**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setErrors({});
  loginMutation.mutate(formData);
};
```

**❓ Question:** What happens when the user clicks the login button?
<details>
<summary>Answer</summary>

1. Form validation runs (`validateForm()`)
2. Errors are cleared
3. `loginMutation.mutate(formData)` is called
4. This sends the email and password to the backend

</details>

---

#### 2️⃣ Follow the service call

**Find line 17-19:**
```typescript
const loginMutation = useMutation({
  mutationFn: authService.login,
  onSuccess: (data) => {
```

This calls `authService.login` - let's find it!

**Open:** `client/src/services/authService.ts`

**Find the login function (line 32-39):**
```typescript
login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
}
```

**❓ Question:** What is this doing?
<details>
<summary>Answer</summary>

1. Makes HTTP POST request to `/auth/login`
2. Receives response with token and user data
3. Stores token in browser's localStorage
4. Stores user info in localStorage
5. Returns the data

</details>

---

#### 3️⃣ Check the API configuration

**Open:** `client/src/config/api.ts`

**Find the baseURL (around line 8):**
```typescript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  ...
});
```

**❓ Question:** What's the full URL that gets called?
<details>
<summary>Answer</summary>

Full URL: `http://localhost:4000/api/auth/login`

- Base: `http://localhost:4000/api`
- Endpoint: `/auth/login`

</details>

---

#### 4️⃣ Find the backend route

**Open:** `server/src/server.ts`

**Find line 69:**
```typescript
app.use('/api/auth', authRoutes);
```

This means all `/api/auth/*` requests go to `authRoutes`.

**Open:** `server/src/routes/auth.ts`

**Find the login route:**
```typescript
router.post('/login', AuthController.login);
```

**❓ Question:** What happens when POST /auth/login is called?
<details>
<summary>Answer</summary>

The `AuthController.login` method is executed.

</details>

---

#### 5️⃣ Examine the controller

**Open:** `server/src/controllers/auth.controller.ts`

**Find the login method (line 144-193):**

```typescript
static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError('Account is not active', 403);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        profile: user.pin || user.csrRep || user.platformManager || null,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
}
```

**❓ Task:** Number the steps this code takes (1-7)

<details>
<summary>Answer</summary>

1. Extract email and password from request body
2. Find user in database by email
3. Check if user exists
4. Check if user account is active
5. Verify password matches
6. Generate JWT token
7. Send response with user data and token

</details>

---

#### 6️⃣ Trace the database query

**Find this line in the controller:**
```typescript
const user = await prisma.user.findUnique({
  where: { email },
  ...
});
```

This queries the database using Prisma.

**Open:** `server/prisma/schema.prisma`

**Find the User model:**
```prisma
model User {
  id        String      @id @default(uuid())
  email     String      @unique
  password  String
  userType  UserType
  status    UserStatus  @default(ACTIVE)
  ...
}
```

**❓ Question:** What SQL does Prisma generate for `findUnique({ where: { email } })`?

<details>
<summary>Answer</summary>

```sql
SELECT * FROM "User" 
WHERE email = 'user@example.com' 
LIMIT 1;
```

</details>

---

### ✅ Exercise 1 Complete!

You've traced the login flow from:
1. User clicks button → LoginPage.tsx
2. Service call → authService.ts
3. HTTP request → http://localhost:4000/api/auth/login
4. Route → auth.ts
5. Controller logic → auth.controller.ts
6. Database query → Prisma → PostgreSQL
7. Response back to frontend

---

## 📚 Exercise 2: Find Authentication Protection

### Goal: Understand how protected routes work

#### 1️⃣ Find a protected route

**Open:** `server/src/routes/opportunities.ts`

**Find this route:**
```typescript
router.get('/', 
  authenticate,
  RequestController.getRequests
);
```

**❓ Question:** What's the purpose of `authenticate`?

---

#### 2️⃣ Examine the authenticate middleware

**Open:** `server/src/middleware/auth.ts`

**Find the authenticate function:**
```typescript
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1]; // "Bearer TOKEN"
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user to request
    (req as any).user = decoded;
    
    next(); // Allow request to continue
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};
```

**❓ Question:** What does this middleware do?

<details>
<summary>Answer</summary>

1. Extracts token from `Authorization` header
2. Verifies the token is valid
3. Decodes user info from token
4. Attaches user info to `req.user`
5. Calls `next()` to continue to controller

If any step fails, it rejects the request with 401 error.

</details>

---

#### 3️⃣ Check the authorize middleware

**Find the authorize function in the same file:**
```typescript
export const authorize = (allowedRoles: UserType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!allowedRoles.includes(user.userType)) {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  };
};
```

**❓ Question:** How would you protect a route so only PINs can access it?

<details>
<summary>Answer</summary>

```typescript
router.post('/requests',
  authenticate,           // Check logged in
  authorize(['PIN']),     // Only allow PINs
  RequestController.createRequest
);
```

</details>

---

### ✅ Exercise 2 Complete!

You now understand:
- How routes are protected with `authenticate`
- How permissions are checked with `authorize`
- How user info is passed to controllers

---

## 📚 Exercise 3: Explore Request Creation

### Goal: Understand CRUD operations

#### 1️⃣ Find the create request route

**Open:** `server/src/routes/opportunities.ts`

**Find:**
```typescript
router.post('/', 
  authenticate,
  authorize(['PIN']),
  validateRequest(createRequestRules),
  RequestController.createRequest
);
```

**❓ Question:** What middleware runs before createRequest?

<details>
<summary>Answer</summary>

1. `authenticate` - Verifies user is logged in
2. `authorize(['PIN'])` - Ensures user is a PIN
3. `validateRequest(createRequestRules)` - Validates input data

</details>

---

#### 2️⃣ Check validation rules

**Open:** `server/src/validators/request.validator.ts`

**Find createRequestRules:**
```typescript
export const createRequestRules = [
  body('categoryId').isString().notEmpty(),
  body('title').isString().trim().isLength({ min: 5, max: 100 }),
  body('description').isString().trim().isLength({ min: 20 }),
  body('urgency').isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
];
```

**❓ Question:** What's required to create a request?

<details>
<summary>Answer</summary>

- `categoryId`: Must be a non-empty string
- `title`: Must be 5-100 characters
- `description`: Must be at least 20 characters
- `urgency`: Must be LOW, MEDIUM, HIGH, or URGENT

</details>

---

#### 3️⃣ Examine the controller

**Open:** `server/src/controllers/request.controller.ts`

**Find createRequest method:**
```typescript
static async createRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { categoryId, title, description, urgency } = req.body;
    const pinId = (req as any).user.pinId;

    const request = await prisma.request.create({
      data: {
        pinId,
        categoryId,
        title,
        description,
        urgency,
        status: RequestStatus.ACTIVE,
      },
      include: {
        category: true,
        pin: true,
      },
    });

    res.status(201).json({ request });
  } catch (error) {
    next(error);
  }
}
```

**❓ Question:** Where does `pinId` come from?

<details>
<summary>Answer</summary>

From `req.user.pinId`, which was set by the `authenticate` middleware when it decoded the JWT token.

</details>

---

### ✅ Exercise 3 Complete!

You now know:
- How to create database records
- How validation works
- How user context flows through middleware

---

## 📚 Exercise 4: Add a Simple Feature

### Goal: Add view count to requests

Let's add a feature that increments a view count every time someone views a request!

#### 1️⃣ Add database field

**Open:** `server/prisma/schema.prisma`

**Find the Request model and add:**
```prisma
model Request {
  id          String        @id @default(uuid())
  title       String
  description String
  viewCount   Int           @default(0)  // ← ADD THIS LINE
  ...
}
```

**Run migration:**
```bash
cd server
npx prisma migrate dev --name add_view_count
```

---

#### 2️⃣ Update controller

**Open:** `server/src/controllers/request.controller.ts`

**Find or create `getRequestById` method:**
```typescript
static async getRequestById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    // Increment view count
    const request = await prisma.request.update({
      where: { id },
      data: {
        viewCount: { increment: 1 }  // Prisma auto-increments
      },
      include: {
        category: true,
        pin: true,
      },
    });

    if (!request) {
      throw new AppError('Request not found', 404);
    }

    res.json({ request });
  } catch (error) {
    next(error);
  }
}
```

---

#### 3️⃣ Add route

**Open:** `server/src/routes/opportunities.ts`

**Add this route:**
```typescript
router.get('/:id', 
  authenticate,
  RequestController.getRequestById
);
```

---

#### 4️⃣ Create frontend service

**Open:** `client/src/services/requestService.ts`

**Add this function:**
```typescript
getRequestById: async (id: string) => {
  const response = await api.get(`/opportunities/${id}`);
  return response.data.request;
}
```

---

#### 5️⃣ Create UI component

**Create:** `client/src/components/RequestDetailPage.tsx`

```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { requestService } from '../services/requestService';

export const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: request, isLoading } = useQuery({
    queryKey: ['request', id],
    queryFn: () => requestService.getRequestById(id!),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{request?.title}</h1>
      <p className="text-gray-600 mb-4">{request?.description}</p>
      <div className="flex items-center text-sm text-gray-500">
        <span>👁️ {request?.viewCount} views</span>
      </div>
    </div>
  );
};
```

---

#### 6️⃣ Test it!

1. Start the server: `npm run dev` (in server/)
2. Start the client: `npm start` (in client/)
3. Navigate to a request detail page
4. Refresh the page - view count should increment!

---

### ✅ Exercise 4 Complete!

You just added a complete feature:
- ✅ Database schema change
- ✅ Backend logic
- ✅ API endpoint
- ✅ Frontend service
- ✅ UI component

---

## 🔍 Debugging Checklist

When something doesn't work, check in this order:

### 1. **Frontend not showing data?**
```
✓ Check browser console for errors
✓ Check Network tab - is API call being made?
✓ Check response - what data is returned?
✓ Verify service function returns correct data
```

### 2. **API returns error?**
```
✓ Check server terminal for error logs
✓ Verify route is defined correctly
✓ Check middleware order (authenticate before authorize)
✓ Verify controller has no syntax errors
```

### 3. **Database query fails?**
```
✓ Check Prisma schema matches database
✓ Run: npx prisma generate
✓ Check migration is applied
✓ Verify field names match exactly (case-sensitive)
```

### 4. **Authentication not working?**
```
✓ Check token is stored in localStorage
✓ Check Authorization header is sent
✓ Verify token hasn't expired
✓ Check authenticate middleware is applied
```

---

## 📝 Common Patterns Cheat Sheet

### Pattern 1: Create a new resource
```typescript
// Route
router.post('/', authenticate, authorize(['ROLE']), Controller.create);

// Controller
static async create(req, res) {
  const data = req.body;
  const userId = req.user.userId;
  
  const resource = await prisma.model.create({
    data: { ...data, userId }
  });
  
  res.status(201).json({ resource });
}
```

### Pattern 2: Get all resources with filters
```typescript
// Controller
static async getAll(req, res) {
  const { status, category } = req.query;
  
  const resources = await prisma.model.findMany({
    where: {
      ...(status && { status }),
      ...(category && { categoryId: category }),
    },
  });
  
  res.json({ resources });
}
```

### Pattern 3: Update a resource
```typescript
// Controller
static async update(req, res) {
  const { id } = req.params;
  const updates = req.body;
  
  const resource = await prisma.model.update({
    where: { id },
    data: updates,
  });
  
  res.json({ resource });
}
```

### Pattern 4: Delete a resource
```typescript
// Controller (soft delete)
static async delete(req, res) {
  const { id } = req.params;
  
  const resource = await prisma.model.update({
    where: { id },
    data: { status: 'DELETED' },
  });
  
  res.json({ message: 'Deleted successfully' });
}
```

---

## 🎯 Next Steps

Now that you understand the codebase:

1. **Pick a user story from the project requirements**
2. **Trace existing similar features**
3. **Implement the new feature following BCE pattern**
4. **Test thoroughly**
5. **Ask for code review**

### Recommended Reading Order:
1. ✅ COMPLETE_BEGINNER_GUIDE.md (Overview)
2. ✅ VISUAL_ARCHITECTURE.md (Diagrams)
3. ✅ HANDS_ON_EXPLORATION.md (This file)
4. → BCE_SIMPLE_GUIDE.md (Framework details)
5. → API_DOCUMENTATION.md (All endpoints)
6. → CLASS_DIAGRAMS.md (Data models)

---

**🎉 You're now ready to contribute to the project!**

Remember: When stuck, trace the flow from UI → Service → Route → Controller → Database. The pattern is always the same!

