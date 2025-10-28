# BCE Diagram - Suspend User Profile (Story #11)

## Modern BCE Architecture with Rich Domain Models

> **Note**: This diagram reflects the **actual implementation** which uses a hybrid architecture combining BCE with Domain-Driven Design principles. Entities contain both CRUD operations AND business logic methods.

---

## Suspend User Profile - Accurate Implementation Flow

```
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│     UserDetailsModal.tsx             │     │  SuspendUserProfileController        │     │   UserAccountEntity + UserProfileEntity │
│         (BOUNDARY)                   │────▶│         (CONTROL)                    │────▶│          (ENTITY)                    │
│      Frontend - React                │     │       Backend - Node.js              │     │   Database + Business Logic          │
├──────────────────────────────────────┤     ├──────────────────────────────────────┤     ├──────────────────────────────────────┤
│                                      │     │                                      │     │                                      │
│ UI Component:                        │     │ API Endpoint:                        │     │ ┌──────────────────────────────────┐ │
│   +profile status badge display      │     │   PUT /admin/profiles/:id/suspend    │     │ │      UserAccountEntity           │ │
│   +suspend profile button            │     │                                      │     │ │  (User Domain Object)            │ │
│   +activate profile button           │     │ +static async handle(                │     │ ├──────────────────────────────────┤ │
│   +confirmation dialog               │     │    req: Request,                     │     │ │ Static Methods (CRUD):           │ │
│   +toast notifications               │     │    res: Response,                    │     │ │   +findById(id): UserAccountEntity│ │
│                                      │     │    next: NextFunction                │     │ │   +findByEmail(email)            │ │
│ API Call:                            │     │  ): Promise<void>                    │     │ │   +create(data)                  │ │
│   +handleProfileStatusChange(        │     │                                      │     │ │   +update(id, data)              │ │
│      newStatus: ProfileStatus        │     │ ══════════════════════════════════   │     │ │   +suspend(id)                   │ │
│    )                                 │     │ ORCHESTRATION LOGIC (Controller):    │     │ │   +activate(id)                  │ │
│   ↓                                  │     │ ══════════════════════════════════   │     │ │                                  │ │
│   api.put(                           │     │                                      │     │ │ Instance Methods (Logic):        │ │
│     `/admin/profiles/${id}/suspend`) │     │ Step 1: Get User & Determine Type    │     │ │   +isActive(): boolean           │ │
│                                      │     │   const userAccount = await          │     │ │   +isSuspended(): boolean        │ │
│ User Actions:                        │     │     UserAccountEntity.findById(id); ─┼─────┼─▶ │   +isAdmin(): boolean           │ │
│   +click_suspend_profile()           │     │   if (!userAccount) throw 404         │     │ │   +isPIN(): boolean              │ │
│   +confirm_suspension()              │     │                                      │     │ │   +isCSRRep(): boolean           │ │
│   +view_success_toast()              │     │ Step 2: Validate Profile Exists      │     │ │   +hasRole(role): boolean        │ │
│                                      │     │   if (!userAccount.userProfile) throw 404 │     │ │   +getProfile(): Profile | null  │ │
│ HTTP Request:                        │     │                                      │     │ │   +toJSON()                      │ │
│   PUT with userId in URL             │     │ Step 3: Suspend Based on Type        │     │ └──────────────────────────────────┘ │
│   Headers: Authorization Bearer      │     │   switch (userAccount.userProfile.role) │     │                                      │
│                                      │     │     case UserProfileRole.PIN:        │     │ ┌──────────────────────────────────┐ │
│ Response Handling:                   │     │       suspendedProfile = await       │     │ │      PINEntity                  │ │
│   - 200: Success                     │     │         PINEntity.suspendByUserId(id)├─────┼─▶ │  (Profile Domain Object)        │ │
│     ↓ Invalidate cache               │     │       break;                         │     │ ├──────────────────────────────────┤ │
│     ↓ Refresh user data              │     │     case UserProfileRole.CSR_REP:    │     │ │ Static Methods (CRUD):           │ │
│     ↓ Show success toast             │     │       suspendedProfile = await       │     │ │   +findById(id)                  │ │
│   - 404: User/Profile not found      │     │         CSRRepEntity                 │     │ │   +findByUserId(userId)          │ │
│   - 400: Cannot suspend admin        │     │           .suspendByUserId(id);──────┼─────┼─▶ │   +create(data)                  │ │
│   - 401: Unauthorized                │     │       break;                         │     │ │   +update(id, data)              │ │
│                                      │     │     case UserProfileRole.PLATFORM_MANAGER: │     │ │   +updateByUserId(userId, data)  │ │
│ State Management:                    │     │       suspendedProfile = await       │     │ │   +suspend(id)                   │ │
│   +React Query cache                 │     │         PlatformManagerEntity        │     │ │   +suspendByUserId(userId)───────┼─┐│
│   +Local component state             │     │           .suspendByUserId(id);──────┼─────┼─▶ │   +activate(id)                 │ ││
│   +Toast notification state          │     │       break;                         │     │ │   +activateByUserId(userId)      │ ││
│                                      │     │     case UserProfileRole.USER_ADMIN: │     │ │   +delete(id)                    │ ││
│ Note:                                │     │       throw AppError(400);           │     │ │                                  │ ││
│   Suspends PROFILE, not account.     │     │   }                                  │     │ │ Instance Methods (Logic):        │ ││
│   User can still login but cannot    │     │                                      │     │ │   +isActive(): boolean           │ ││
│   perform role-specific tasks.       │     │ Step 4: Format Response              │     │ │   +isSuspended(): boolean        │ ││
└──────────────────────────────────────┘     │   res.json({                         │     │ │   +isProfileComplete(): boolean  │ ││
         ↑                                    │     message: "...",                   │     │ │   +getDisplayName(): string      │ ││
         │                                    │     userAccount: {                   │     │ │   +hasAccessibilityNeeds() [PIN] │ ││
   User Interface                            │       id, email, userProfile,        │     │ │   +isSenior(): boolean [PIN]     │ ││
   (Presentation)                            │       status },                      │     │ │   +hasLogo(): boolean [CSRRep]   │ ││
                                             │     profile: suspendedProfile        │     │ │   +toJSON()                      │ ││
                                             │   });                                │     │ └──────────────────────────────────┘ ││
                                             │                                      │     │                                      ││
                                             │ ══════════════════════════════════   │     │ ┌──────────────────────────────────┐ ││
                                             │ ERROR HANDLING (Controller):         │     │ │      Prisma Database             │ ││
                                             │ ══════════════════════════════════   │     │ │    (Data Persistence)            │ ││
                                             │ +throw AppError(404)                 │     │ ├──────────────────────────────────┤ ││
                                             │   if user not found                  │     │ │ prisma.user.findUnique()         │ ││
                                             │ +throw AppError(404)                 │     │ │ prisma.pIN.update()       ◀──────┼─┘│
                                             │   if profile not found               │     │ │ prisma.cSRRep.update()           │  │
                                             │ +throw AppError(400)                 │     │ │ prisma.platformManager.update()  │  │
                                             │   if userType is ADMIN               │     │ │                                  │  │
                                             │ +next(error)                         │     │ │ Updates profile.status to        │  │
                                             │   pass to error middleware           │     │ │ ProfileStatus.SUSPENDED          │  │
                                             │                                      │     │ └──────────────────────────────────┘  │
                                             └──────────────────────────────────────┘     └──────────────────────────────────────┘
                                                        ↑                                             ↑
                                                        │                                             │
                                              Business Logic Layer                        Domain Models + Data Access
                                              (Orchestration +                            (Business Logic + CRUD +
                                               HTTP Handling)                              Database Operations)
```

---

## Key Architectural Points:

### 1. **Hybrid Architecture: BCE + Rich Domain Models**
This codebase uses a **modern, practical interpretation** of BCE:
- **Entities are NOT anemic data structures** - they contain business logic about themselves
- **Controllers handle orchestration** - coordinating multiple entities and HTTP concerns
- This follows **Domain-Driven Design (DDD)** principles

### 2. **Entity Layer Contains Two Types of Methods**

#### **Static Methods (Data Access / CRUD)**
- `findById(id)` - Database query
- `findByUserId(userId)` - Database query
- `create(data)` - Database insert
- `update(id, data)` - Database update
- `suspendByUserId(userId)` - Calls `updateByUserId()` with status change
- `activateByUserId(userId)` - Calls `updateByUserId()` with status change

#### **Instance Methods (Business Logic)**
These are methods that operate on the entity's **own data**:
- `isActive()` - Check own status
- `isSuspended()` - Check own status
- `isAdmin()` - Check own type
- `isPIN()` - Check own type
- `getProfile()` - Get own related profile
- `isProfileComplete()` - Validate own completeness
- `getDisplayName()` - Format own data

**Why this is good**: These methods encapsulate logic about the entity's own state. They belong with the data they operate on.

### 3. **Controller's Role: Orchestration**
The controller does NOT contain entity-specific business logic. Instead, it:
1. **Extracts data from HTTP request** (req.params)
2. **Coordinates multiple entities** (UserEntity, then profile entity)
3. **Implements workflow logic** (switch statement to determine which entity)
4. **Handles errors** (AppError for various cases)
5. **Formats HTTP response** (res.json)

### 4. **Two-Step Entity Interaction**
   - **Step 1**: Controller calls `UserAccountEntity.findById(id)` to retrieve user account
   - **Step 2**: Based on `userAccount.userProfile.role`, controller calls **ONE** of:
     - `PINEntity.suspendByUserId(id)` OR
     - `CSRRepEntity.suspendByUserId(id)` OR  
     - `PlatformManagerEntity.suspendByUserId(id)`
   - This is a **conditional flow**, not parallel

### 5. **Profile vs Account Suspension**
   - **Profile Suspension**: Suspends the role-specific profile (PIN, CSRRep, or PlatformManager)
   - **Effect**: User can still login but cannot perform role-specific tasks
   - **Account Status**: Unchanged (user account remains ACTIVE)

### 6. **Error Handling**
   - 404 if user doesn't exist
   - 404 if the specific profile for that user type doesn't exist
   - 400 if attempting to suspend an ADMIN profile (not allowed)

### 7. **Actual Implementation Code**
   ```typescript
   // Controller orchestrates the flow
   const userAccount = await UserAccountEntity.findById(id);  // Step 1
   if (!userAccount) throw new AppError('User account not found', 404);

   // Step 2: Conditional entity call based on role
   switch (userAccount.userProfile.role) {
     case UserProfileRole.PIN:
       if (!userAccount.pin) throw new AppError('PIN profile not found', 404);
       suspendedProfile = await PINEntity.suspendByUserId(id);
       break;
     case UserProfileRole.CSR_REP:
       if (!userAccount.csrRep) throw new AppError('CSR Rep profile not found', 404);
       suspendedProfile = await CSRRepEntity.suspendByUserId(id);
       break;
     case UserProfileRole.PLATFORM_MANAGER:
       if (!userAccount.platformManager) throw new AppError('Platform Manager profile not found', 404);
       suspendedProfile = await PlatformManagerEntity.suspendByUserId(id);
       break;
     case UserProfileRole.USER_ADMIN:
       throw new AppError('Cannot suspend admin profile', 400);
   }
   ```

---

## Architecture Justification:

### ✅ **Why Business Logic in Entities is CORRECT**

#### **Anemic Domain Model (Anti-Pattern)**
```typescript
// ❌ BAD: All logic in controller, entity is just data
class UserAccountEntity {
  id: string;
  status: UserStatus;
  // No methods, just data
}

// Controller has to know entity internals
if (userAccount.status === UserStatus.ACTIVE) { ... }
```

#### **Rich Domain Model (Best Practice)** ⭐
```typescript
// ✅ GOOD: Entity encapsulates its own logic
class UserAccountEntity {
  id: string;
  status: UserStatus;
  userProfile: UserProfile;
  
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;  // Entity knows itself
  }
  
  hasRole(role: UserProfileRole): boolean {
    return this.userProfile?.role === role;
  }
}

// Controller uses entity's interface
if (userAccount.isActive() && userAccount.hasRole(UserProfileRole.PIN)) { ... }
```

### **Benefits**:
1. **Encapsulation**: Logic about entity is WITH the entity
2. **Single Responsibility**: Entity manages its own state
3. **Testability**: Can test business logic without controller/HTTP layer
4. **Maintainability**: Changes to logic happen in one place
5. **Readability**: `user.isActive()` is clearer than `user.status === UserStatus.ACTIVE`

### **Industry Standard**:
- Recommended by Martin Fowler, Eric Evans (DDD), Robert C. Martin (Clean Architecture)
- Used in production systems at Google, Microsoft, Airbnb, etc.
- Aligns with OOP principles (encapsulation, cohesion)

---

## Comparison: What Changed from Original Diagram

### ❌ **Original Diagram Issues**:
1. Wrong Boundary: `AdminDashboard` instead of `UserDetailsModal`
2. Missing Entity Business Logic: Only showed CRUD methods
3. Simplified Entity representation: Didn't show instance methods
4. Unclear about conditional flow: Looked like all entities called simultaneously
5. Missing critical detail: Business logic methods that exist in entities

### ✅ **This Accurate Diagram Shows**:
1. **Correct Boundary**: `UserDetailsModal.tsx` with `handleProfileStatusChange()`
2. **Entity Structure**: Both static (CRUD) AND instance (business logic) methods
3. **Clear Separation**: What's in Controller vs what's in Entity
4. **Conditional Flow**: Only ONE profile entity called based on user type
5. **Actual Architecture**: Hybrid BCE + Rich Domain Models
6. **Database Layer**: Shows Prisma as the actual persistence mechanism
