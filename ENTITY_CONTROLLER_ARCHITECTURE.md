# 🏗️ Entity-Controller Architecture Implementation Guide

## 📋 What Your Tutor Wants

Your tutor wants you to implement the **Repository Pattern** / **Service Layer Pattern**:

```
❌ CURRENT (Direct DB access):
Controller → Prisma → Database

✅ REQUIRED (Layered architecture):
Controller → Entity/Repository → Prisma → Database
```

---

## 🎯 Architecture Layers

### 1. **Entity Classes** (Data Models)
- Represent your database models
- Match your Prisma schema
- May include business logic methods
- Located in: `src/entities/`

### 2. **Repository Classes** (Database Access)
- Methods to interact with database
- One repository per entity
- All Prisma queries go here
- Located in: `src/repositories/`

### 3. **Service Classes** (Business Logic) [Optional]
- Complex business logic
- Combines multiple repositories
- Located in: `src/services/`

### 4. **Controllers** (HTTP Layer)
- Handle requests/responses
- Call repository/service methods
- NO direct Prisma access
- Located in: `src/controllers/`

---

## 📊 Current vs Required Structure

### ❌ CURRENT (Your controllers now):
```typescript
// viewUserAccounts.controller.ts
export class ViewUserAccountsController {
  static async handle(req: Request, res: Response) {
    // ❌ Direct Prisma access in controller
    const users = await prisma.user.findMany({
      skip, take: limit,
      include: { pin: true, csrRep: true }
    });
    res.json({ users });
  }
}
```

### ✅ REQUIRED (What tutor wants):
```typescript
// userRepository.ts
export class UserRepository {
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return prisma.user.findMany({
      skip, take: limit,
      include: { pin: true, csrRep: true }
    });
  }
}

// viewUserAccounts.controller.ts
export class ViewUserAccountsController {
  static async handle(req: Request, res: Response) {
    // ✅ Call repository method
    const userRepo = new UserRepository();
    const users = await userRepo.findAll(page, limit);
    res.json({ users });
  }
}
```

---

## 🔧 Implementation Plan

### Phase 1: Create Entity Classes
Match your Prisma schema:
- UserEntity
- PINEntity  
- CSRRepEntity
- PlatformManagerEntity
- RequestEntity
- ServiceCategoryEntity
- MatchEntity
- NotificationEntity

### Phase 2: Create Repository Classes
One repository per entity with CRUD methods:
- UserRepository
- PINRepository
- CSRRepRepository
- RequestRepository
- etc.

### Phase 3: Refactor Controllers
Update all controllers to use repositories instead of Prisma

---

## 📝 Example Implementation

### Step 1: Create Entity Class
```typescript
// src/entities/User.entity.ts
import { User as PrismaUser, UserType, UserStatus } from '@prisma/client';

export class UserEntity implements PrismaUser {
  id: string;
  email: string;
  password: string;
  userType: UserType;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: PrismaUser) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.userType = data.userType;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Business logic methods
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isAdmin(): boolean {
    return this.userType === UserType.ADMIN;
  }
}
```

### Step 2: Create Repository Class
```typescript
// src/repositories/User.repository.ts
import { prisma } from '../config/database';
import { UserEntity } from '../entities/User.entity';
import { UserType, UserStatus } from '@prisma/client';

export class UserRepository {
  // Find all users with pagination
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return users.map(user => new UserEntity(user));
  }

  // Find user by ID
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return user ? new UserEntity(user) : null;
  }

  // Find user by email
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return user ? new UserEntity(user) : null;
  }

  // Create user
  async create(data: {
    email: string;
    password: string;
    userType: UserType;
    status?: UserStatus;
  }) {
    const user = await prisma.user.create({
      data: {
        ...data,
        status: data.status || UserStatus.ACTIVE,
      },
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return new UserEntity(user);
  }

  // Update user
  async update(id: string, data: Partial<UserEntity>) {
    const user = await prisma.user.update({
      where: { id },
      data,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return new UserEntity(user);
  }

  // Delete user
  async delete(id: string) {
    await prisma.user.delete({ where: { id } });
    return true;
  }

  // Count users
  async count() {
    return prisma.user.count();
  }

  // Search users
  async search(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { pin: { name: { contains: query, mode: 'insensitive' } } },
          { csrRep: { companyName: { contains: query, mode: 'insensitive' } } },
        ],
      },
      skip,
      take: limit,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return users.map(user => new UserEntity(user));
  }
}
```

### Step 3: Refactor Controller
```typescript
// src/controllers/userAdmin/viewUserAccounts.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../repositories/User.repository';
import { AppError } from '../../middleware/errorHandler';

export class ViewUserAccountsController {
  private static userRepository = new UserRepository();

  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { id } = req.params;

      // If ID is provided, get single user
      if (id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
          throw new AppError('User not found', 404);
        }
        res.json({ user });
        return;
      }

      // Otherwise get all users
      const users = await this.userRepository.findAll(page, limit);
      const total = await this.userRepository.count();

      res.json({ users, total, page, limit });
    } catch (error) {
      next(error);
    }
  }
}
```

---

## 🎯 Benefits of This Architecture

### 1. **Separation of Concerns**
- Controllers handle HTTP
- Repositories handle DB
- Clean boundaries

### 2. **Testability**
- Easy to mock repositories
- Test business logic separately
- Test controllers without DB

### 3. **Maintainability**
- Changes to DB logic in one place
- Easy to understand
- Follows SOLID principles

### 4. **Reusability**
- Repository methods used by multiple controllers
- Don't repeat DB queries
- Consistent data access

### 5. **Meets Academic Requirements**
- Proper OOP design
- Industry best practices
- Clear architecture

---

## 📚 File Structure

```
src/
├── entities/                    # Entity classes (data models)
│   ├── User.entity.ts
│   ├── PIN.entity.ts
│   ├── CSRRep.entity.ts
│   ├── Request.entity.ts
│   └── index.ts
│
├── repositories/                # Repository classes (DB access)
│   ├── User.repository.ts
│   ├── PIN.repository.ts
│   ├── CSRRep.repository.ts
│   ├── Request.repository.ts
│   └── index.ts
│
├── services/                    # Service classes (business logic)
│   ├── User.service.ts         # Optional for complex logic
│   ├── Matching.service.ts
│   └── index.ts
│
└── controllers/                 # Controllers (HTTP handlers)
    ├── auth/
    │   └── login.controller.ts → calls UserRepository
    ├── userAdmin/
    │   └── viewUserAccounts.controller.ts → calls UserRepository
    └── ...
```

---

## 🚀 Implementation Steps

### Step 1: Create Base Entities (I'll do this)
- UserEntity
- PINEntity
- CSRRepEntity
- PlatformManagerEntity
- RequestEntity

### Step 2: Create Base Repositories (I'll do this)
- UserRepository (with all CRUD methods)
- PINRepository
- CSRRepRepository
- RequestRepository

### Step 3: Refactor Controllers (I'll show examples)
- Update ViewUserAccounts controller
- Update SearchUserAccounts controller
- Update other controllers to use repositories

### Step 4: Test Everything
- Ensure all endpoints still work
- Test with existing test accounts
- Verify no breaking changes

---

## ⚠️ Important Notes

### DO:
- ✅ All Prisma queries go in repositories
- ✅ Controllers call repository methods
- ✅ Keep entity classes simple
- ✅ One repository per entity

### DON'T:
- ❌ Don't use Prisma in controllers
- ❌ Don't put business logic in entities (keep them simple)
- ❌ Don't skip the entity layer
- ❌ Don't mix responsibilities

---

## 🧪 Testing After Implementation

### Before (Direct Prisma):
```typescript
// Hard to test - requires database
const users = await prisma.user.findMany();
```

### After (Repository Pattern):
```typescript
// Easy to test - mock repository
const mockRepo = {
  findAll: jest.fn().mockResolvedValue([mockUser])
};
const users = await mockRepo.findAll();
```

---

## 📖 Academic Justification

This architecture follows:
- **MVC Pattern** (Model-View-Controller)
- **Repository Pattern** (Data access abstraction)
- **Dependency Injection** (Loose coupling)
- **SOLID Principles** (Single Responsibility, Open/Closed)
- **Clean Architecture** (Separation of concerns)

**Perfect for academic projects!** ✅

---

## 🎓 What to Tell Your Tutor

> "I've implemented the Repository Pattern where:
> - Entity classes represent database models
> - Repository classes contain all database interaction methods
> - Controllers call repository methods instead of directly accessing Prisma
> - This provides clear separation of concerns and follows OOP principles"

---

Ready to implement? Let me know and I'll create the entity classes, repositories, and refactor your controllers!
