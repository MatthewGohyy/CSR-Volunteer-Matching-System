# BCE Implementation Explanation: User Story #10

**Story:** As a User Admin, I want to update a user profile so that the latest information is shown.

**Status:** ✅ Implemented

---

## Overview

This document explains the **Boundary-Controller-Entity (BCE)** framework implementation for updating a user profile. The BCE pattern separates concerns into three layers:
- **Boundary**: User interface and API communication (Frontend)
- **Controller**: Business logic and orchestration (Backend)
- **Entity**: Database operations (Backend)

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                          │
│                                                                  │
│  1. Admin clicks "Save" button in UserProfileDetailsModal      │
└──────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BOUNDARY (Frontend)                       │
│              client/src/components/UserProfileDetailsModal.tsx   │
│                                                                  │
│  2. saveChanges() function executes                             │
│     - Builds updatePayload with changed fields                  │
│     - Makes API call: PUT /admin/profiles/:id                   │
│     - Payload: { name?, description?, isActive? }                │
└──────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP PUT Request
                             │ /api/admin/profiles/:id
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ROUTE MAPPING                            │
│              server/src/routes/admin.ts                           │
│                                                                  │
│  3. Route: PUT /profiles/:id                                     │
│     Handler: UpdateUserProfileController.handle                 │
└──────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CONTROLLER (Backend)                        │
│     server/src/controllers/userAdmin/updateUserProfile.controller│
│                                                                  │
│  4. Controller Logic:                                            │
│     a) Extract id from params, fields from body                  │
│     b) Validate: Check if profile exists                         │
│        → UserProfile.findById(id)                                │
│     c) Validate: Check name uniqueness (if name changed)         │
│        → UserProfile.findByName(name)                            │
│     d) Build updateData object with provided fields              │
│     e) Call Entity: UserProfile.update(id, updateData)           │
│     f) Return JSON response with updated profile                 │
└──────────────────────────┬────────────────────────────────────┘
                             │
                             │ Entity Method Call
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        ENTITY (Backend)                          │
│              server/src/entities/UserProfile.entity.ts           │
│                                                                  │
│  5. UserProfile.update() method:                                 │
│     - Uses Prisma to update database                             │
│     - Updates only fields in data object                         │
│     - Returns new UserProfile instance                           │
└──────────────────────────┬────────────────────────────────────┘
                             │
                             │ UserProfile Object
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        RESPONSE FLOW                              │
│                                                                  │
│  6. Entity → Controller → Route → Frontend                      │
│     Response: {                                                  │
│       message: "User profile updated successfully",              │
│       profile: { ... UserProfile data ... }                     │
│     }                                                            │
│                                                                  │
│  7. Frontend Actions:                                            │
│     - Invalidates React Query cache                              │
│     - Refreshes profile data                                     │
│     - Exits edit mode                                            │
│     - Shows success toast                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Step-by-Step Breakdown

### Step 1: User Interaction (Boundary)

**Location:** `client/src/components/UserProfileDetailsModal.tsx`

**Action:** User clicks the "Save" button

```tsx
<button
  onClick={saveChanges}
  disabled={isProcessing}
  className="flex items-center px-3 py-1 text-sm font-medium text-green-600..."
>
  <Save className="h-4 w-4 mr-1" />
  Save
</button>
```

---

### Step 2: Frontend Processing (Boundary)

**Function:** `saveChanges()`

**Key Operations:**
1. **Build Update Payload**: Only includes fields that have changed
   ```typescript
   const updatePayload: Partial<{name, description, isActive}> = {};
   
   if (editFormData.name !== currentProfile.name) {
     updatePayload.name = editFormData.name;
   }
   if (editFormData.description !== (currentProfile.description || '')) {
     updatePayload.description = editFormData.description;
   }
   if (editFormData.isActive !== currentProfile.isActive) {
     updatePayload.isActive = editFormData.isActive;
   }
   ```

2. **API Call**: Makes PUT request to backend
   ```typescript
   await api.put(`/admin/profiles/${profile.id}`, updatePayload);
   ```

**Full Code:**
```typescript
const saveChanges = async () => {
  setIsProcessing(true);
  try {
    // Build update payload - only send fields that changed
    const updatePayload: Partial<{
      name: string;
      description: string;
      isActive: boolean;
    }> = {};

    if (editFormData.name !== currentProfile.name) {
      updatePayload.name = editFormData.name;
    }
    if (editFormData.description !== (currentProfile.description || '')) {
      updatePayload.description = editFormData.description;
    }
    if (editFormData.isActive !== currentProfile.isActive) {
      updatePayload.isActive = editFormData.isActive;
    }

    await api.put(`/admin/profiles/${profile.id}`, updatePayload);
    queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    if (onUpdate) onUpdate();
    
    await refreshProfileData();
    setIsEditing(false);
    
    setToast({
      message: 'Profile updated successfully',
      type: 'success'
    });
  } catch (error: any) {
    alert(error.response?.data?.error || 'Failed to update profile');
  } finally {
    setIsProcessing(false);
  }
};
```

---

### Step 3: Route Mapping

**Location:** `server/src/routes/admin.ts`

**Route Configuration:**
```typescript
// Story #10: Update user profile
router.put('/profiles/:id', UpdateUserProfileController.handle);
```

**Route Path:** `PUT /api/admin/profiles/:id`

**Handler:** `UpdateUserProfileController.handle`

---

### Step 4: Controller Logic (Controller)

**Location:** `server/src/controllers/userAdmin/updateUserProfile.controller.ts`

**Controller Responsibilities:**

1. **Extract Request Data**
   ```typescript
   const { id } = req.params;
   const { name, description, permissions, isActive } = req.body;
   ```

2. **Validation: Check Profile Exists**
   ```typescript
   const existingProfile = await UserProfile.findById(id);
   if (!existingProfile) {
     throw new AppError('Profile not found', 404);
   }
   ```
   - **Entity Method Used:** `UserProfile.findById(id)`
   - **Purpose:** Verify the profile exists before updating

3. **Validation: Check Name Uniqueness**
   ```typescript
   if (name && name !== existingProfile.name) {
     const nameExists = await UserProfile.findByName(name);
     if (nameExists) {
       throw new AppError('Profile with this name already exists', 409);
     }
   }
   ```
   - **Entity Method Used:** `UserProfile.findByName(name)`
   - **Purpose:** Ensure profile name remains unique

4. **Build Update Data Object**
   ```typescript
   const updateData: Partial<{
     name: string;
     description: string;
     permissions: any;
     isActive: boolean;
   }> = {};
   
   if (name !== undefined) updateData.name = name;
   if (description !== undefined) updateData.description = description;
   if (permissions !== undefined) updateData.permissions = permissions;
   if (isActive !== undefined) updateData.isActive = isActive;
   ```

5. **Call Entity Method**
   ```typescript
   const updatedProfile = await UserProfile.update(id, updateData);
   ```
   - **Entity Method Used:** `UserProfile.update(id, updateData)`

6. **Return Response**
   ```typescript
   res.json({
     message: 'User profile updated successfully',
     profile: updatedProfile,
   });
   ```

**Full Controller Code:**
```typescript
export class UpdateUserProfileController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, permissions, isActive } = req.body;

      // Check if profile exists
      const existingProfile = await UserProfile.findById(id);
      if (!existingProfile) {
        throw new AppError('Profile not found', 404);
      }

      // If name is being changed, check if new name already exists
      if (name && name !== existingProfile.name) {
        const nameExists = await UserProfile.findByName(name);
        if (nameExists) {
          throw new AppError('Profile with this name already exists', 409);
        }
      }

      // Build update data (only include fields that are provided)
      const updateData: Partial<{
        name: string;
        description: string;
        permissions: any;
        isActive: boolean;
      }> = {};
      
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (permissions !== undefined) updateData.permissions = permissions;
      if (isActive !== undefined) updateData.isActive = isActive;

      // Update profile
      const updatedProfile = await UserProfile.update(id, updateData);

      res.json({
        message: 'User profile updated successfully',
        profile: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

### Step 5: Entity Database Operation (Entity)

**Location:** `server/src/entities/UserProfile.entity.ts`

**Entity Method:** `UserProfile.update()`

**Implementation:**
```typescript
static async update(id: string, data: Partial<{
  name: string;
  description: string;
  permissions: any;
  isActive: boolean;
}>) {
  const profile = await prisma.userProfile.update({
    where: { id },
    data,
  });
  return new UserProfile(profile);
}
```

**What It Does:**
1. Uses Prisma ORM to update the database record
2. Updates only the fields specified in `data`
3. Returns a new `UserProfile` instance with updated data

---

## Data Flow Summary

| Layer | Component | Input | Output |
|-------|-----------|-------|--------|
| **Boundary** | `UserProfileDetailsModal.saveChanges()` | User clicks Save | `PUT /admin/profiles/:id` with payload |
| **Route** | `router.put('/profiles/:id')` | HTTP Request | Routes to Controller |
| **Controller** | `UpdateUserProfileController.handle()` | Request params + body | Calls Entity methods, returns JSON |
| **Entity** | `UserProfile.update()` | `id` + `updateData` | Updated `UserProfile` instance |

---

## Entity Methods Used

The controller uses **three entity methods**:

1. **`UserProfile.findById(id)`** - Verify profile exists
   ```typescript
   const existingProfile = await UserProfile.findById(id);
   ```

2. **`UserProfile.findByName(name)`** - Check name uniqueness
   ```typescript
   const nameExists = await UserProfile.findByName(name);
   ```

3. **`UserProfile.update(id, updateData)`** - Perform database update
   ```typescript
   const updatedProfile = await UserProfile.update(id, updateData);
   ```

---

## HTTP Request/Response Examples

### Request
```http
PUT /api/admin/profiles/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "CSR Representative",
  "description": "Updated description",
  "isActive": true
}
```

### Success Response
```json
{
  "message": "User profile updated successfully",
  "profile": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "CSR Representative",
    "description": "Updated description",
    "permissions": null,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T12:00:00.000Z"
  }
}
```

### Error Response (Profile Not Found)
```json
{
  "error": "Profile not found"
}
```
Status: `404 Not Found`

### Error Response (Name Already Exists)
```json
{
  "error": "Profile with this name already exists"
}
```
Status: `409 Conflict`

---

## Frontend Response Handling

After receiving the response, the frontend:

1. **Invalidates Cache**
   ```typescript
   queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
   ```

2. **Refreshes Profile Data**
   ```typescript
   await refreshProfileData(); // Calls GET /admin/profiles/:id
   ```

3. **Exits Edit Mode**
   ```typescript
   setIsEditing(false);
   ```

4. **Shows Success Notification**
   ```typescript
   setToast({
     message: 'Profile updated successfully',
     type: 'success'
   });
   ```

---

## BCE Pattern Benefits

This implementation demonstrates proper BCE separation:

✅ **Boundary (Frontend)** - Handles user interaction, form management, API calls  
✅ **Controller (Backend)** - Contains business logic, validation, orchestration  
✅ **Entity (Backend)** - Manages database operations (Prisma)

**Key Benefits:**
- Clear separation of concerns
- Business logic centralized in controller
- Database operations abstracted in entity
- Easy to test and maintain
- Follows project architecture standards

---

## Related Files

### Boundary (Frontend)
- `client/src/components/UserProfileDetailsModal.tsx`
- `client/src/components/AdminDashboard.tsx`

### Controller (Backend)
- `server/src/controllers/userAdmin/updateUserProfile.controller.ts`

### Entity (Backend)
- `server/src/entities/UserProfile.entity.ts`

### Routes (Backend)
- `server/src/routes/admin.ts`

---

**Last Updated:** January 2024  
**Story ID:** #10  
**Status:** ✅ Complete

