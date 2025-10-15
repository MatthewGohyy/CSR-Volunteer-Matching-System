# 🎴 Quick Reference Card

> **Keep this handy while coding!**

---

## 📂 Where is Everything?

### Frontend (Client)
```
client/src/
├── components/        → UI screens
├── services/          → API calls
├── types/            → Data types
└── config/           → Settings
```

### Backend (Server)
```
server/src/
├── routes/           → API endpoints
├── controllers/      → Business logic
├── middleware/       → Auth & validation
└── utils/            → Helpers

server/prisma/
└── schema.prisma     → Database
```

---

## 🔄 Data Flow Pattern

```
User Action
    ↓
Component (UI)
    ↓
Service (API call)
    ↓
Route (Endpoint)
    ↓
Middleware (Auth/Validation)
    ↓
Controller (Logic)
    ↓
Database (Prisma)
    ↓
Response back up
```

---

## 🎯 BCE Quick Map

| Layer | Frontend | Backend |
|-------|----------|---------|
| **BOUNDARY** | `components/`, `services/` | `routes/` |
| **CONTROL** | - | `controllers/`, `middleware/` |
| **ENTITY** | - | `prisma/schema.prisma` |

---

## 🔐 Authentication Flow

```typescript
// 1. Login
POST /api/auth/login
→ Returns { user, token }
→ Store in localStorage

// 2. Protected Request
GET /api/opportunities
Headers: { 
  Authorization: "Bearer <token>" 
}
→ Middleware verifies token
→ Attaches user to req.user
→ Controller uses req.user
```

---

## 📝 Common Code Patterns

### Frontend: API Call
```typescript
// Service
export const myService = {
  getData: async () => {
    const response = await api.get('/endpoint');
    return response.data;
  }
};

// Component
const { data } = useQuery({
  queryKey: ['myData'],
  queryFn: myService.getData
});
```

### Backend: Route + Controller
```typescript
// Route
router.post('/resource',
  authenticate,
  authorize(['ROLE']),
  validateRequest(rules),
  Controller.create
);

// Controller
static async create(req, res) {
  const data = req.body;
  const result = await prisma.model.create({
    data
  });
  res.status(201).json({ result });
}
```

### Database: CRUD
```typescript
// Create
await prisma.model.create({ data })

// Read
await prisma.model.findUnique({ where: { id } })
await prisma.model.findMany({ where: { status } })

// Update
await prisma.model.update({ 
  where: { id }, 
  data: { name } 
})

// Delete (soft)
await prisma.model.update({ 
  where: { id }, 
  data: { status: 'DELETED' } 
})
```

---

## 🛠️ Common Tasks

### Add New Endpoint
1. Add route in `routes/*.ts`
2. Create controller method
3. Add validation if needed
4. Test with Postman/Thunder Client

### Add New UI Page
1. Create component in `components/`
2. Add route in `App.tsx`
3. Create service for API calls
4. Connect with useQuery/useMutation

### Change Database
1. Update `schema.prisma`
2. Run `npx prisma migrate dev --name <name>`
3. Run `npx prisma generate`
4. Update TypeScript types

---

## 🐛 Debugging Checklist

### Frontend Not Working?
- [ ] Check browser console
- [ ] Check Network tab
- [ ] Verify API URL in `config/api.ts`
- [ ] Check token in localStorage

### Backend Error?
- [ ] Check server terminal
- [ ] Verify route exists
- [ ] Check middleware order
- [ ] Look at controller logic

### Database Issue?
- [ ] Run `npx prisma generate`
- [ ] Check migrations applied
- [ ] Verify field names match
- [ ] Use `npx prisma studio` to check data

### Auth Not Working?
- [ ] Token stored in localStorage?
- [ ] Authorization header sent?
- [ ] Token not expired?
- [ ] User has correct role?

---

## 🚀 Quick Commands

### Start Everything
```bash
# Terminal 1: Database
docker-compose up -d

# Terminal 2: Backend
cd server && npm run dev

# Terminal 3: Frontend
cd client && npm start
```

### Database
```bash
cd server

# Generate client
npx prisma generate

# Create migration
npx prisma migrate dev --name <name>

# Reset database (dev only)
npx prisma migrate reset

# Open GUI
npx prisma studio
```

### Development
```bash
# Install dependencies
npm install

# Run tests
npm test

# Check types
npm run type-check

# Lint
npm run lint
```

---

## 📍 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | React app |
| Backend | http://localhost:4000 | API server |
| API Health | http://localhost:4000/health | Check status |
| Prisma Studio | Run `npx prisma studio` | Database GUI |
| pgAdmin | http://localhost:5050 | PostgreSQL GUI |

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `server.ts` | Main server file |
| `schema.prisma` | Database schema |
| `auth.ts` (middleware) | Authentication |
| `api.ts` (config) | API configuration |
| `App.tsx` | Main React component |
| `.env` | Environment variables |

---

## 📊 User Types & Permissions

| User Type | Can Do |
|-----------|--------|
| **PIN** | Create/manage requests |
| **CSR_REP** | View/shortlist requests, make offers |
| **USER_ADMIN** | Manage users and profiles |
| **PLATFORM_MANAGER** | Manage categories, view reports |

---

## 🎯 Request Status Flow

```
PIN creates request
    ↓
ACTIVE (visible to CSR Reps)
    ↓
CSR Rep shortlists
    ↓
CSR Rep makes offer
    ↓
PIN accepts/declines
    ↓
MATCHED (if accepted)
    ↓
Work completed
    ↓
FULFILLED
```

---

## 🔍 Finding Things

### Find a file
```bash
find . -name "filename.ts"
```

### Search in files
```bash
grep -r "searchterm" src/
```

### Find where something is used
```bash
grep -r "functionName" .
```

---

## 💾 Database Models (Key)

```
User
├── id
├── email
├── password
└── userType → PIN | CSR_REP | USER_ADMIN | PLATFORM_MANAGER

Request
├── id
├── title
├── description
├── status
└── pinId (FK)

Match
├── id
├── requestId (FK)
├── csrRepId (FK)
└── status
```

---

## 🎨 Frontend State Management

```typescript
// React Query for server state
const { data, isLoading } = useQuery({
  queryKey: ['key'],
  queryFn: fetchFunction
});

// Mutation for updates
const mutation = useMutation({
  mutationFn: updateFunction,
  onSuccess: () => {
    // Invalidate cache
    queryClient.invalidateQueries(['key']);
  }
});
```

---

## 🛡️ Middleware Order Matters!

```typescript
// ✅ Correct order
router.post('/endpoint',
  authenticate,        // 1. Check if logged in
  authorize(['ROLE']), // 2. Check permissions
  validateRequest,     // 3. Validate data
  Controller.method    // 4. Execute logic
);

// ❌ Wrong order (validation before auth)
router.post('/endpoint',
  validateRequest,     // Won't have user context!
  authenticate,
  Controller.method
);
```

---

## 📝 Environment Variables

### Backend (.env)
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
PORT=4000
NODE_ENV=development
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:4000/api
```

---

## 🎯 Testing Endpoints

### With curl
```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Protected endpoint
curl http://localhost:4000/api/opportunities \
  -H "Authorization: Bearer <token>"
```

### With Prisma Studio
```bash
cd server
npx prisma studio
# Opens http://localhost:5555
```

---

## 🚨 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| Port already in use | `lsof -i :3000` then `kill -9 <PID>` |
| Prisma Client not found | `npx prisma generate` |
| Migration failed | Check schema, fix, retry |
| CORS error | Check `cors()` in server.ts |
| 401 Unauthorized | Check token, check middleware |
| 403 Forbidden | Check user role permissions |

---

## 📚 Quick Documentation Links

- **Start Learning:** [START_HERE.md](./START_HERE.md)
- **Quick Summary:** [UNDERSTANDING_SUMMARY.md](./UNDERSTANDING_SUMMARY.md)
- **Detailed Guide:** [COMPLETE_BEGINNER_GUIDE.md](./COMPLETE_BEGINNER_GUIDE.md)
- **Hands-On:** [HANDS_ON_EXPLORATION.md](./HANDS_ON_EXPLORATION.md)
- **API Docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 💡 Pro Tips

1. **Use TypeScript autocomplete** - Let VS Code guide you
2. **Check Prisma schema** - It's the source of truth for data
3. **Follow the pattern** - Look at existing code, copy the structure
4. **Test as you go** - Don't write everything then test
5. **Read error messages** - They usually tell you what's wrong
6. **Use console.log** - Debug by printing values
7. **Check Network tab** - See exactly what's being sent/received

---

**🎴 Keep this card handy while coding!**

Print it, bookmark it, or keep it open in a tab.

