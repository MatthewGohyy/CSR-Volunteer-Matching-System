# BCE Diagram - Suspend User Profile (Story #11)

## Classical Boundary-Control-Entity Architecture

---

## Suspend User Profile

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│    UserDetailsModal.tsx             │     │  SuspendUserProfileController        │     │   UserEntity + Profile Entities     │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
│      Frontend - React               │     │       Backend - Node.js              │     │      Database - Prisma              │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ UI Component:                       │     │ API Endpoint:                        │     │ 1) UserEntity                       │
│   +profile status badge display     │     │   PUT /admin/profiles/:id/suspend    │     │   +static async findById(id)        │
│   +suspend profile button           │     │                                      │     │   Returns: UserEntity with:         │
│   +activate profile button          │     │ +static async handle(                │     │     - id, email, userType           │
│   +confirmation dialog              │     │    req: Request,                     │     │     - status, pin, csrRep           │
│   +toast notifications              │     │    res: Response,                    │     │     - platformManager               │
│                                     │     │    next: NextFunction                │     │                                     │
│ API Call:                           │     │  ): Promise<void>                    │     │ 2) Based on user.userType:          │
│   +api.put(                         │     │                                      │     │                                     │
│     `/admin/profiles/${id}/suspend`)│     │ // Business Logic:                   │     │ IF userType === PIN:                │
│                                     │     │ 1. Extract id from req.params        │     │   +PINEntity.suspendByUserId(id)    │
│ User Actions:                       │     │ 2. UserEntity.findById(id)           │     │   Updates: { status: 'SUSPENDED' } │
│   +click_suspend_profile()          │     │    ↓ Get user & determine type       │     │                                     │
│   +confirm_suspension()             │     │ 3. Switch on user.userType:          │     │ IF userType === CSR_REP:            │
│   +view_success_toast()             │     │    case UserType.PIN:                │     │   +CSRRepEntity.suspendByUserId(id) │
│                                     │     │      ▶ PINEntity.suspendByUserId()   │     │   Updates: { status: 'SUSPENDED' } │
│ HTTP Request:                       │     │    case UserType.CSR_REP:            │     │                                     │
│   PUT with userId in URL            │     │      ▶ CSRRepEntity.suspendByUserId()│     │ IF userType === PLATFORM_MANAGER:   │
│   Headers: Authorization Bearer     │     │    case UserType.PLATFORM_MANAGER:   │     │   +PlatformManagerEntity            │
│                                     │     │      ▶ PlatformManagerEntity          │     │    .suspendByUserId(id)             │
│ Response Handling:                  │     │        .suspendByUserId()            │     │   Updates: { status: 'SUSPENDED' } │
│   - 200: Show success toast         │     │ 4. Return suspended profile          │     │                                     │
│   - 404: "User not found"           │     │                                      │     │ model PIN {                         │
│   - 404: "Profile not found"        │     │ // Error Handling:                   │     │   id: string                        │
│   - 400: "Cannot suspend admin"     │     │ +throw AppError (404)                │     │   userId: string @unique            │
│   - 401: "Unauthorized"             │     │   if user not found                  │     │   status: ProfileStatus             │
│                                     │     │ +throw AppError (404)                │     │   // other fields...                │
│ State Management:                   │     │   if profile not found               │     │ }                                   │
│   +invalidate React Query cache     │     │ +throw AppError (400)                │     │                                     │
│   +refresh user data                │     │   if userType is ADMIN               │     │ model CSRRep {                      │
│   +update local state               │     │                                      │     │   id: string                        │
│                                     │     │ HTTP Response:                       │     │   userId: string @unique            │
│ Note:                               │     │   JSON with:                         │     │   status: ProfileStatus             │
│   - Suspends PROFILE, not account   │     │   - message                          │     │   // other fields...                │
│   - User can still login            │     │   - user: { id, email, userType,     │     │ }                                   │
│   - Cannot perform role tasks       │     │           status (unchanged) }       │     │                                     │
│                                     │     │   - profile: { id, userId, status,   │     │ model PlatformManager {             │
│                                     │     │               ...other fields }      │     │   id: string                        │
│                                     │     │                                      │     │   userId: string @unique            │
│                                     │     │ Key Decision Logic:                  │     │   status: ProfileStatus             │
│                                     │     │   The controller does NOT call all   │     │   // other fields...                │
│                                     │     │   entities. It calls UserEntity      │     │ }                                   │
│                                     │     │   first, then conditionally calls    │     │                                     │
│                                     │     │   ONLY ONE profile entity based on   │     │ enum ProfileStatus {                │
│                                     │     │   the user's type.                   │     │   ACTIVE, SUSPENDED                 │
│                                     │     │                                      │     │ }                                   │
└─────────────────────────────────────┘     └──────────────────────────────────────┘     └─────────────────────────────────────┘
         ↑                                              ↑                                             ↑
         │                                              │                                             │
   User Interface                             Business Logic Layer                        Data Persistence Layer
   (Presentation)                             (Application Layer)                          (Domain Models)
```

---

## Key Architectural Points:

### 1. **Two-Step Entity Interaction**
   - The controller first calls `UserEntity.findById(id)` to retrieve the user and determine their type
   - Based on the `userType`, it then calls the appropriate profile entity's suspend method
   - This is a **conditional flow**, not a parallel flow to all entities

### 2. **Profile vs Account Suspension**
   - **Profile Suspension**: Suspends the role-specific profile (PIN, CSRRep, or PlatformManager)
   - **Effect**: User can still login but cannot perform role-specific tasks
   - **Account Status**: Unchanged (user account remains ACTIVE)

### 3. **Error Handling**
   - 404 if user doesn't exist
   - 404 if the specific profile for that user type doesn't exist
   - 400 if attempting to suspend an ADMIN profile (not allowed)

### 4. **Switch Statement Logic**
   The controller uses a switch statement to resolve which entity to call:
   ```typescript
   switch (user.userType) {
     case UserType.PIN:
       suspendedProfile = await PINEntity.suspendByUserId(id);
       break;
     case UserType.CSR_REP:
       suspendedProfile = await CSRRepEntity.suspendByUserId(id);
       break;
     case UserType.PLATFORM_MANAGER:
       suspendedProfile = await PlatformManagerEntity.suspendByUserId(id);
       break;
     case UserType.ADMIN:
       throw new AppError('Cannot suspend admin profile', 400);
   }
   ```

### 5. **Entity Methods**
   Each profile entity provides:
   - `suspendByUserId(userId: string)`: Suspends profile by user ID
   - Internally calls: `updateByUserId(userId, { status: ProfileStatus.SUSPENDED })`

---

## Comparison with Original Diagram:

### ❌ Issues in Original Diagram:
1. **Wrong Boundary Component**: Showed `AdminDashboard` instead of `UserDetailsModal`
2. **Wrong Method Name**: Showed `clickSuspendProfile(userId)` instead of `handleProfileStatusChange(newStatus)`
3. **Wrong Controller Method**: Showed `handle(userId)` instead of `handle(req, res, next)`
4. **Non-existent Method**: Showed `resolveProfileHandler(userType)` which doesn't exist
5. **Missing UserEntity**: Didn't show the critical first step of calling `UserEntity.findById()`
6. **Incorrect Flow**: Showed all three profile entities being called simultaneously, when only ONE is called based on user type

### ✅ Corrections Made:
1. **Correct Boundary**: `UserDetailsModal` component
2. **Correct Method**: `handleProfileStatusChange(newStatus: ProfileStatus)`
3. **Correct Controller Signature**: `handle(req: Request, res: Response, next: NextFunction)`
4. **Two-Step Process**: Shows `UserEntity.findById()` first, then conditional profile entity call
5. **Conditional Flow**: Clearly indicates only ONE profile entity is called based on user type
6. **Accurate Business Logic**: Reflects the actual switch statement implementation
