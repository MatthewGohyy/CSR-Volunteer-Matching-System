# Testing Guide: User Story 11 - User Account vs User Profile Suspension

## Quick Start Testing

### Prerequisites
1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend:
```bash
cd client
npm start
```

3. Login as Admin user
4. Navigate to Admin Dashboard

---

## Test Case 1: View User Account and Profile Sections

### Steps:
1. In Admin Dashboard, click the **eye icon** (👁️) on any user
2. The User Details Modal opens

### Expected Result:
You should see **TWO distinct sections**:

#### 🔐 User Account Section (Blue background)
- Title: "User Account (Authentication)"
- Shows account status badge
- Shows email and account creation date
- Has suspend/activate button for the account

#### 👤 User Profile Section (Purple background, if not admin)
- Title: "User Profile (Role & Permissions)"
- Shows profile status badge
- Has suspend/activate button for the profile

---

## Test Case 2: Suspend User Account (Block Login)

### Steps:
1. Open a PIN or CSR Rep user details
2. In the **User Account** section (blue), click "Suspend Account (Block Login)"
3. Confirm the action
4. Note the user's email
5. Logout from admin
6. Try to login with that user's credentials

### Expected Result:
- Account status changes to "SUSPENDED"
- User account section shows: ⚠️ "User cannot login - Account is suspended"
- Login attempt fails with error: "Account suspended. Please contact support."
- User **cannot login**

### Cleanup:
1. Login back as admin
2. Open the same user details
3. Click "Activate Account (Allow Login)"

---

## Test Case 3: Suspend User Profile (Disable Role Tasks)

### Steps:
1. Open a PIN user details
2. In the **User Profile** section (purple), click "Suspend Profile (Disable Tasks)"
3. Confirm the action
4. Note the user's email and password
5. Logout from admin
6. Login with that PIN user's credentials
7. Try to create a new request

### Expected Result:
- Profile status changes to "SUSPENDED"
- Profile section shows: ⚠️ "User can login but cannot perform role-specific tasks"
- User **can login successfully** ✓
- User can view their dashboard
- When trying to create a request, receives error: "Profile suspended. You can login but cannot perform role-specific actions."

### Cleanup:
1. Logout and login back as admin
2. Open the same user details
3. Click "Activate Profile (Enable Tasks)"

---

## Test Case 4: Both Account and Profile Suspended

### Steps:
1. Open a CSR Rep user details
2. Suspend **both** the account AND the profile
3. Logout from admin
4. Try to login with that CSR Rep's credentials

### Expected Result:
- Both status badges show "SUSPENDED"
- Login is blocked (account suspension takes precedence)
- Error: "Account suspended"

### Cleanup:
1. Login back as admin
2. Activate both account and profile

---

## Test Case 5: Independent Status Management

### Steps:
1. Create or select a PIN user
2. Suspend the **profile only** (not the account)
3. Close the modal and reopen it
4. Verify profile is suspended, account is active
5. Activate the profile
6. Suspend the **account only**
7. Close and reopen modal
8. Verify account is suspended, profile is active

### Expected Result:
- Each status is maintained independently
- Visual indicators clearly show which is suspended
- Status changes persist across modal open/close

---

## Test Case 6: Visual Indicators

### Steps:
1. Open multiple users with different status combinations:
   - Active account + Active profile
   - Suspended account + Active profile
   - Active account + Suspended profile
   - Suspended account + Suspended profile

### Expected Result for Each:

| Account Status | Profile Status | Can Login? | Can Perform Tasks? | Visual Indicator |
|---|---|---|---|---|
| ACTIVE | ACTIVE | ✅ Yes | ✅ Yes | Green badges, checkmarks |
| SUSPENDED | ACTIVE | ❌ No | N/A | Red account badge, green profile badge |
| ACTIVE | SUSPENDED | ✅ Yes | ❌ No | Green account badge, red profile badge |
| SUSPENDED | SUSPENDED | ❌ No | N/A | Red badges for both |

---

## Test Case 7: Admin Users (No Profile Section)

### Steps:
1. Create or view an ADMIN user
2. Open their details

### Expected Result:
- Only the **User Account** section appears (blue)
- No **User Profile** section (admins don't have role-specific profiles)
- Can only suspend/activate the account

---

## Test Case 8: API Endpoint Testing

### Using curl or Postman:

#### Test Suspend Account:
```bash
curl -X PUT http://localhost:5000/api/admin/users/{userId}/suspend \
  -H "Authorization: Bearer {adminToken}"
```

#### Test Suspend Profile:
```bash
curl -X PUT http://localhost:5000/api/admin/profiles/{userId}/suspend \
  -H "Authorization: Bearer {adminToken}"
```

#### Test Activate Profile:
```bash
curl -X PUT http://localhost:5000/api/admin/profiles/{userId}/activate \
  -H "Authorization: Bearer {adminToken}"
```

---

## Test Case 9: Database Verification

### Check Profile Status in Database:
```sql
-- Check PIN profiles
SELECT u.email, u.status as account_status, p.name, p.status as profile_status 
FROM users u 
JOIN pins p ON u.id = p."userId" 
WHERE u."userType" = 'PIN';

-- Check CSR Rep profiles
SELECT u.email, u.status as account_status, c."companyName", c.status as profile_status 
FROM users u 
JOIN csr_reps c ON u.id = c."userId" 
WHERE u."userType" = 'CSR_REP';

-- Check Platform Manager profiles
SELECT u.email, u.status as account_status, pm."fullName", pm.status as profile_status 
FROM users u 
JOIN platform_managers pm ON u.id = pm."userId" 
WHERE u."userType" = 'PLATFORM_MANAGER';
```

Expected: All profile status fields should exist with values (ACTIVE, SUSPENDED, or DEACTIVATED)

---

## Common Issues & Solutions

### Issue 1: Modal shows old status after change
**Solution**: The modal should close automatically after status change. If not, close and reopen.

### Issue 2: Profile status not showing
**Cause**: Old data without status field
**Solution**: Run the migration again:
```bash
cd server
npx prisma migrate reset
npx prisma migrate dev
```

### Issue 3: "Cannot read property 'status' of undefined"
**Cause**: Profile doesn't exist
**Solution**: Ensure the user has a profile created (PIN, CSR Rep, or Platform Manager)

---

## Success Criteria

✅ **User Story 11 is successfully implemented if:**

1. Admin can see two separate sections for Account and Profile
2. Suspending account blocks login
3. Suspending profile allows login but blocks role tasks
4. Each status can be managed independently
5. Visual indicators clearly show the difference
6. Both statuses persist across page refreshes
7. API endpoints work correctly for both account and profile operations

---

## Next Steps After Testing

1. **Apply to role-specific routes**: Update other controllers to use `requireActiveProfile` middleware where appropriate
2. **Add audit logging**: Track who suspended/activated accounts and profiles
3. **Add notifications**: Email users when their account/profile status changes
4. **Documentation**: Update API documentation with new endpoints

---

## Need Help?

- Review `USER_STORY_11_IMPLEMENTATION.md` for technical details
- Check `server/src/middleware/auth.ts` for authentication logic
- See `client/src/components/UserDetailsModal.tsx` for UI implementation

