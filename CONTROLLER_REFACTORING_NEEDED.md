# 🔨 Controller Refactoring Required

> **Requirement:** Each controller should handle ONE user story. Similar stories (like login for different user types) can share a controller.

---

## ❌ Current Structure (INCORRECT)

```
controllers/
├── auth.controller.ts          → Multiple stories (#1, #2, #13, #14, #24, #25, #33, #34 + register)
├── admin.controller.ts         → Multiple stories (#3-#12)
├── pin.controller.ts           → Multiple stories (#16-#23)
├── csrRep.controller.ts        → Multiple stories (#26-#32)
├── request.controller.ts       → Multiple stories (#15-#18)
├── platformManager.controller.ts → Multiple stories (#35-#39)
└── match.controller.ts         → Matching logic (not mapped to user stories)
```

**Problem:** Each controller handles MULTIPLE user stories instead of ONE.

---

## ✅ Required Structure (CORRECT)

### 🔐 Authentication Controllers (Stories #1, #2, #13, #14, #24, #25, #33, #34)

Since login/logout are the same feature for different user types, they can share controllers:

```
controllers/auth/
├── login.controller.ts         → Stories #1, #13, #24, #33 (All login stories)
└── logout.controller.ts        → Stories #2, #14, #25, #34 (All logout stories)
```

---

### 🧑‍💼 User Admin Controllers (Stories #3-#12)

Each story gets its own controller:

```
controllers/userAdmin/
├── createUserAccount.controller.ts      → Story #3
├── viewUserAccounts.controller.ts       → Story #4
├── updateUserAccount.controller.ts      → Story #5
├── suspendUserAccount.controller.ts     → Story #6
├── searchUserAccounts.controller.ts     → Story #7
├── createUserProfile.controller.ts      → Story #8
├── viewUserProfiles.controller.ts       → Story #9
├── updateUserProfile.controller.ts      → Story #10
├── suspendUserProfile.controller.ts     → Story #11
└── searchUserProfiles.controller.ts     → Story #12
```

---

### 🙋‍♀️ PIN Controllers (Stories #15-#23)

```
controllers/pin/
├── createRequest.controller.ts              → Story #15
├── viewMyRequests.controller.ts             → Story #16
├── updateRequest.controller.ts              → Story #17
├── deleteRequest.controller.ts              → Story #18
├── searchMyRequests.controller.ts           → Story #19
├── viewRequestViews.controller.ts           → Story #20
├── viewRequestShortlists.controller.ts      → Story #21
├── searchCompletedRequests.controller.ts    → Story #22
└── viewCompletedRequests.controller.ts      → Story #23
```

---

### 🤝 CSR Representative Controllers (Stories #26-#32)

```
controllers/csrRep/
├── searchRequests.controller.ts             → Story #26
├── viewRequests.controller.ts               → Story #27
├── saveRequest.controller.ts                → Story #28 (Shortlist)
├── searchShortlist.controller.ts            → Story #29
├── viewShortlist.controller.ts              → Story #30
├── searchCompletedRequests.controller.ts    → Story #31
└── viewCompletedRequests.controller.ts      → Story #32
```

---

### 🧭 Platform Manager Controllers (Stories #35-#39)

```
controllers/platformManager/
├── createCategory.controller.ts     → Story #35
├── viewCategories.controller.ts     → Story #36
├── updateCategory.controller.ts     → Story #37
├── deleteCategory.controller.ts     → Story #38
└── searchCategories.controller.ts   → Story #39
```

---

## 📊 Refactoring Summary

### Total Controllers Needed: **31 controllers**

| Role | User Stories | Controllers Needed | Current | Change |
|------|--------------|-------------------|---------|--------|
| **Auth** | #1, #2, #13, #14, #24, #25, #33, #34 | 2 | 1 | Split +1 |
| **User Admin** | #3 - #12 | 10 | 1 | Split +9 |
| **PIN** | #15 - #23 | 9 | 2 | Split +7 |
| **CSR Rep** | #26 - #32 | 7 | 1 | Split +6 |
| **Platform Manager** | #35 - #39 | 5 | 1 | Split +4 |
| **Total** | 39 stories | **31** | 7 | **+24** |

Note: 8 stories share controllers (login/logout for 4 user types = 2 shared controllers)

---

## 🔄 Migration Plan

### Phase 1: Create New Structure (1-2 hours)

1. **Create folder structure:**
```bash
mkdir -p server/src/controllers/auth
mkdir -p server/src/controllers/userAdmin
mkdir -p server/src/controllers/pin
mkdir -p server/src/controllers/csrRep
mkdir -p server/src/controllers/platformManager
```

2. **Extract and reorganize controllers** (split existing into individual files)

---

### Phase 2: Update Routes (30 min)

Update route files to import from new controller locations:

```typescript
// OLD
import { AuthController } from '../controllers/auth.controller';
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// NEW
import { LoginController } from '../controllers/auth/login.controller';
import { LogoutController } from '../controllers/auth/logout.controller';
router.post('/login', LoginController.handle);
router.post('/logout', LogoutController.handle);
```

---

### Phase 3: Test (30 min)

- Test each endpoint
- Verify functionality unchanged
- Update any broken imports

---

## 📝 Controller Template

Each controller should follow this pattern:

```typescript
// controllers/userAdmin/createUserAccount.controller.ts

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

/**
 * User Story #3: As a User Admin, I want to create user accounts 
 * so that new users can log in.
 */
export class CreateUserAccountController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Implementation for creating user account
      const { email, password, userType } = req.body;
      
      // Business logic here...
      
      res.status(201).json({ message: 'User account created successfully' });
    } catch (error) {
      next(error);
    }
  }
}
```

---

## 🎯 Benefits of This Structure

1. **Clear Traceability** ✅
   - Each controller maps directly to a user story
   - Easy to find which code implements which requirement

2. **Single Responsibility** ✅
   - Each controller does ONE thing
   - Easier to maintain and test

3. **Team Collaboration** ✅
   - Different team members can work on different user stories
   - No merge conflicts in large controller files

4. **Testing** ✅
   - One test file per user story
   - Clear test coverage mapping

5. **Documentation** ✅
   - Controller name = user story feature
   - Self-documenting code structure

---

## 🚨 Action Items

### Immediate Tasks:

1. **Create folder structure**
2. **Extract LoginController** from auth.controller.ts
3. **Extract LogoutController** from auth.controller.ts
4. **Extract all Admin controllers** from admin.controller.ts
5. **Extract all PIN controllers** from pin.controller.ts + request.controller.ts
6. **Extract all CSR Rep controllers** from csrRep.controller.ts
7. **Extract all Platform Manager controllers** from platformManager.controller.ts
8. **Update all route imports**
9. **Test all endpoints**
10. **Delete old controller files**

---

## 📋 Detailed Breakdown

### Current → New Mapping

#### auth.controller.ts → Split into 2:
```
login() → auth/login.controller.ts (Stories #1, #13, #24, #33)
logout() → auth/logout.controller.ts (Stories #2, #14, #25, #34)
registerPIN() → Remove (registration handled separately)
registerCSRRep() → Remove (registration handled separately)
```

#### admin.controller.ts → Split into 10:
```
createUser() → userAdmin/createUserAccount.controller.ts (#3)
getUsers() → userAdmin/viewUserAccounts.controller.ts (#4)
updateUser() → userAdmin/updateUserAccount.controller.ts (#5)
suspendUser() → userAdmin/suspendUserAccount.controller.ts (#6)
searchUsers() → userAdmin/searchUserAccounts.controller.ts (#7)
createProfile() → userAdmin/createUserProfile.controller.ts (#8)
getUserProfiles() → userAdmin/viewUserProfiles.controller.ts (#9)
updateProfile() → userAdmin/updateUserProfile.controller.ts (#10)
suspendProfile() → userAdmin/suspendUserProfile.controller.ts (#11)
searchProfiles() → userAdmin/searchUserProfiles.controller.ts (#12)
```

#### request.controller.ts + pin.controller.ts → Split into 9:
```
createRequest() → pin/createRequest.controller.ts (#15)
getMyRequests() → pin/viewMyRequests.controller.ts (#16)
updateRequest() → pin/updateRequest.controller.ts (#17)
deleteRequest() → pin/deleteRequest.controller.ts (#18)
searchMyRequests() → pin/searchMyRequests.controller.ts (#19)
getRequestViews() → pin/viewRequestViews.controller.ts (#20)
getRequestShortlists() → pin/viewRequestShortlists.controller.ts (#21)
searchCompletedRequests() → pin/searchCompletedRequests.controller.ts (#22)
getCompletedRequests() → pin/viewCompletedRequests.controller.ts (#23)
```

#### csrRep.controller.ts → Split into 7:
```
searchRequests() → csrRep/searchRequests.controller.ts (#26)
getRequests() → csrRep/viewRequests.controller.ts (#27)
shortlistRequest() → csrRep/saveRequest.controller.ts (#28)
searchShortlist() → csrRep/searchShortlist.controller.ts (#29)
getShortlist() → csrRep/viewShortlist.controller.ts (#30)
searchCompletedRequests() → csrRep/searchCompletedRequests.controller.ts (#31)
getCompletedRequests() → csrRep/viewCompletedRequests.controller.ts (#32)
```

#### platformManager.controller.ts → Split into 5:
```
createCategory() → platformManager/createCategory.controller.ts (#35)
getCategories() → platformManager/viewCategories.controller.ts (#36)
updateCategory() → platformManager/updateCategory.controller.ts (#37)
deleteCategory() → platformManager/deleteCategory.controller.ts (#38)
searchCategories() → platformManager/searchCategories.controller.ts (#39)
```

---

## ✅ Checklist for Each Controller

- [ ] Contains reference to user story number in comments
- [ ] Has single `handle()` method
- [ ] Follows naming convention: `<Feature>.controller.ts`
- [ ] Located in appropriate folder
- [ ] Has corresponding route
- [ ] Has unit tests
- [ ] Documentation updated

---

## 🎯 Expected Final Structure

```
controllers/
├── auth/
│   ├── login.controller.ts           (Stories #1, #13, #24, #33)
│   └── logout.controller.ts          (Stories #2, #14, #25, #34)
│
├── userAdmin/
│   ├── createUserAccount.controller.ts      (#3)
│   ├── viewUserAccounts.controller.ts       (#4)
│   ├── updateUserAccount.controller.ts      (#5)
│   ├── suspendUserAccount.controller.ts     (#6)
│   ├── searchUserAccounts.controller.ts     (#7)
│   ├── createUserProfile.controller.ts      (#8)
│   ├── viewUserProfiles.controller.ts       (#9)
│   ├── updateUserProfile.controller.ts      (#10)
│   ├── suspendUserProfile.controller.ts     (#11)
│   └── searchUserProfiles.controller.ts     (#12)
│
├── pin/
│   ├── createRequest.controller.ts          (#15)
│   ├── viewMyRequests.controller.ts         (#16)
│   ├── updateRequest.controller.ts          (#17)
│   ├── deleteRequest.controller.ts          (#18)
│   ├── searchMyRequests.controller.ts       (#19)
│   ├── viewRequestViews.controller.ts       (#20)
│   ├── viewRequestShortlists.controller.ts  (#21)
│   ├── searchCompletedRequests.controller.ts (#22)
│   └── viewCompletedRequests.controller.ts  (#23)
│
├── csrRep/
│   ├── searchRequests.controller.ts         (#26)
│   ├── viewRequests.controller.ts           (#27)
│   ├── saveRequest.controller.ts            (#28)
│   ├── searchShortlist.controller.ts        (#29)
│   ├── viewShortlist.controller.ts          (#30)
│   ├── searchCompletedRequests.controller.ts (#31)
│   └── viewCompletedRequests.controller.ts  (#32)
│
└── platformManager/
    ├── createCategory.controller.ts         (#35)
    ├── viewCategories.controller.ts         (#36)
    ├── updateCategory.controller.ts         (#37)
    ├── deleteCategory.controller.ts         (#38)
    └── searchCategories.controller.ts       (#39)
```

**Total: 31 controller files** (2 + 10 + 9 + 7 + 5)

---

## 📞 Next Steps

1. **Review this refactoring plan** with the team
2. **Assign user stories** to team members
3. **Create branch** for refactoring
4. **Start with auth controllers** (simplest split)
5. **Progressively refactor** other controllers
6. **Update documentation** as you go

---

**Created:** 2025-10-15  
**Priority:** HIGH  
**Estimated Effort:** 4-6 hours  
**Status:** Planning  

---

**Note:** This is a significant architectural change. Consider doing it in a separate branch and merging carefully to avoid breaking existing functionality.

