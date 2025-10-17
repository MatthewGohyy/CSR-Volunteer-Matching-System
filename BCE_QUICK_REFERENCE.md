# BCE Framework - Quick Reference

## Architecture Flow

```
┌─────────────────────────────────────────────────────────┐
│                    BOUNDARY LAYER                        │
│                 (Client Components)                      │
│                                                          │
│  LoginPage.tsx, AdminDashboard.tsx, Dashboard.tsx, etc. │
│                                                          │
│  - Handles user input                                   │
│  - Makes direct API calls using axios                   │
│  - Displays data to users                               │
│  - Manages local state                                  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ HTTP Request (api.post, api.get, etc.)
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   CONTROLLER LAYER                       │
│                  (Server Controllers)                    │
│                                                          │
│  server/src/controllers/auth/login.controller.ts        │
│  server/src/controllers/userAdmin/*.controller.ts       │
│                                                          │
│  - Receives HTTP requests                               │
│  - Validates input                                      │
│  - Calls Entity methods                                 │
│  - Returns HTTP responses                               │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ Method Call (Entity.method())
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    ENTITY LAYER                          │
│                (Server Entities)                         │
│                                                          │
│  server/src/entities/User.entity.ts                     │
│  server/src/entities/PIN.entity.ts                      │
│                                                          │
│  - Contains CRUD methods                                │
│  - Interacts with database (Prisma)                     │
│  - Handles data validation                              │
│  - Returns data objects                                 │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ Prisma ORM
                      │
                      ▼
              ┌───────────────┐
              │   DATABASE    │
              │  PostgreSQL   │
              └───────────────┘
```

## Example: Login Flow

### 1. Boundary (LoginPage.tsx)
```typescript
import api from '../config/api';

const loginMutation = useMutation({
  mutationFn: async (credentials: LoginCredentials) => {
    // Direct API call to Controller
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
});
```

### 2. Controller (login.controller.ts)
```typescript
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Call Entity method
  const user = await User.findByEmail(email);
  
  // Business logic and response
  res.json({ user, token });
};
```

### 3. Entity (User.entity.ts)
```typescript
export class User {
  static async findByEmail(email: string) {
    // Database interaction via Prisma
    return prisma.user.findUnique({ where: { email } });
  }
}
```

## Key Rules

### ✅ DO:
- Make API calls directly from components
- Use the `api` instance from `config/api.ts`
- Keep components focused on UI and user interaction
- Use proper TypeScript types for API responses
- Handle errors at the component level

### ❌ DON'T:
- Create service layers between Boundary and Controller
- Add business logic in components
- Add UI logic in controllers
- Mix concerns between layers

## API Call Examples

### GET Request
```typescript
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const response = await api.get<UsersResponse>('/admin/users');
    return response.data;
  }
});
```

### POST Request
```typescript
const mutation = useMutation({
  mutationFn: async (userData: CreateUserData) => {
    const response = await api.post<{ user: User }>('/admin/users', userData);
    return response.data;
  }
});
```

### PUT Request
```typescript
const mutation = useMutation({
  mutationFn: async (id: string) => {
    const response = await api.put(`/admin/users/${id}/status`, { status: 'ACTIVE' });
    return response.data;
  }
});
```

### DELETE Request
```typescript
const mutation = useMutation({
  mutationFn: async (id: string) => {
    await api.delete(`/admin/users/${id}`);
  }
});
```

## File Structure

```
client/
├── src/
│   ├── components/          # BOUNDARY LAYER
│   │   ├── LoginPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ...
│   ├── config/
│   │   └── api.ts          # Axios instance (NOT a service layer)
│   └── types/
│       └── index.ts        # TypeScript types

server/
├── src/
│   ├── controllers/        # CONTROLLER LAYER
│   │   ├── auth/
│   │   ├── userAdmin/
│   │   └── ...
│   └── entities/          # ENTITY LAYER
│       ├── User.entity.ts
│       ├── PIN.entity.ts
│       └── ...
```

## Authentication Flow

```typescript
// Login
const response = await api.post('/auth/login', { email, password });
localStorage.setItem('token', response.data.token);

// Logout
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/';

// Auto-attach token (config/api.ts handles this)
// Token is automatically added to all requests via interceptor
```

## Error Handling

```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    const response = await api.post('/endpoint', data);
    return response.data;
  },
  onError: (error: any) => {
    const errorMessage = error.response?.data?.error || 'Operation failed';
    setErrors({ general: errorMessage });
  }
});
```

## Benefits of This Architecture

1. **Clear Separation**: Each layer has a distinct responsibility
2. **No Ambiguity**: Data flow is straightforward and easy to trace
3. **Type Safety**: TypeScript types ensure correctness
4. **Maintainability**: Easy to understand and modify
5. **Testability**: Each layer can be tested independently
6. **Scalability**: Easy to add new features following the same pattern

## Common Patterns

### Fetching Data
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', id],
  queryFn: async () => {
    const response = await api.get(`/endpoint/${id}`);
    return response.data;
  }
});
```

### Creating Data
```typescript
const createMutation = useMutation({
  mutationFn: async (newData: DataType) => {
    const response = await api.post('/endpoint', newData);
    return response.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['resource'] });
  }
});
```

### Updating Data
```typescript
const updateMutation = useMutation({
  mutationFn: async ({ id, data }: { id: string; data: DataType }) => {
    const response = await api.put(`/endpoint/${id}`, data);
    return response.data;
  }
});
```

### Deleting Data
```typescript
const deleteMutation = useMutation({
  mutationFn: async (id: string) => {
    await api.delete(`/endpoint/${id}`);
  }
});
```

## Remember

**The golden rule of BCE:**
> Boundary → Controller → Entity → Database
> 
> No intermediary layers, no shortcuts, just clean architecture.

