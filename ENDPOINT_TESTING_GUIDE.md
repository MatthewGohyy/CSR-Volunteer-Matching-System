# Endpoint Testing Guide

## 🧪 Testing All Refactored Controllers

This guide provides step-by-step instructions for testing all newly refactored endpoints.

---

## 📋 Prerequisites

1. **Start the server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Tools needed**:
   - Postman, Insomnia, or curl
   - Valid test user accounts for each user type

3. **Test data**:
   - Use the seeded database (run `npm run seed` if needed)
   - Note down test user credentials

---

## 🔑 Authentication Endpoints

### 1. Login (Stories #1, #13, #24, #33)
**Endpoint**: `POST /api/auth/login`

**Test Cases**:

```json
// Test 1: User Admin Login
{
  "email": "admin@example.com",
  "password": "password123"
}

// Test 2: PIN Login
{
  "email": "pin@example.com",
  "password": "password123"
}

// Test 3: CSR Rep Login
{
  "email": "csr@example.com",
  "password": "password123"
}

// Test 4: Platform Manager Login
{
  "email": "manager@example.com",
  "password": "password123"
}

// Test 5: Invalid credentials
{
  "email": "admin@example.com",
  "password": "wrongpassword"
}
```

**Expected Results**:
- ✅ Returns `200` with token and user info
- ✅ Returns `401` for invalid credentials
- ✅ Returns `403` for suspended accounts

---

### 2. Logout (Stories #2, #14, #25, #34)
**Endpoint**: `POST /api/auth/logout`

**Headers**: `Authorization: Bearer <token>`

**Test Cases**:
```bash
# Test 1: Valid logout
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer <your-token>"

# Test 2: Logout without token
curl -X POST http://localhost:5000/api/auth/logout
```

**Expected Results**:
- ✅ Returns `200` with success message
- ✅ Returns `401` without token

---

## 👤 User Admin Endpoints

### User Account Management

#### 3. Create User Account (Story #3)
**Endpoint**: `POST /api/admin/users`

**Headers**: `Authorization: Bearer <admin-token>`

**Test Case**:
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "userType": "PIN",
  "fullName": "New User"
}
```

**Expected**: `201` with created user

---

#### 4. View User Accounts (Story #4)
**Endpoints**:
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get specific user

**Headers**: `Authorization: Bearer <admin-token>`

**Test Cases**:
```bash
# Get all users
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer <admin-token>"

# Get specific user
curl http://localhost:5000/api/admin/users/{userId} \
  -H "Authorization: Bearer <admin-token>"
```

**Expected**: `200` with user data

---

#### 5. Update User Account (Story #5)
**Endpoint**: `PUT /api/admin/users/:id`

**Headers**: `Authorization: Bearer <admin-token>`

**Test Case**:
```json
{
  "email": "updated@example.com",
  "fullName": "Updated Name"
}
```

**Expected**: `200` with updated user

---

#### 6. Suspend User Account (Story #6)
**Endpoint**: `PUT /api/admin/users/:id/suspend`

**Headers**: `Authorization: Bearer <admin-token>`

**Test Case**:
```json
{
  "suspend": true,
  "reason": "Violation of terms"
}
```

**Expected**: `200` with suspended user

---

#### 7. Search User Accounts (Story #7)
**Endpoint**: `GET /api/admin/users/search?query=<search-term>`

**Headers**: `Authorization: Bearer <admin-token>`

**Test Cases**:
```bash
# Search by email
curl "http://localhost:5000/api/admin/users/search?query=admin" \
  -H "Authorization: Bearer <admin-token>"

# Search by name
curl "http://localhost:5000/api/admin/users/search?query=John" \
  -H "Authorization: Bearer <admin-token>"
```

**Expected**: `200` with matching users

---

### Profile Management

#### 8. Create User Profile (Story #8)
**Endpoint**: `POST /api/admin/profiles`

**Headers**: `Authorization: Bearer <admin-token>`

**Test Case**:
```json
{
  "userId": "user-id-here",
  "userType": "PIN",
  "profileData": {
    "bio": "Test bio",
    "location": "Test location"
  }
}
```

**Expected**: `201` with created profile

---

#### 9. View User Profiles (Story #9)
**Endpoints**:
- `GET /api/admin/profiles` - List all profiles
- `GET /api/admin/profiles/:id` - Get specific profile

**Headers**: `Authorization: Bearer <admin-token>`

**Expected**: `200` with profile data

---

#### 10. Update User Profile (Story #10)
**Endpoint**: `PUT /api/admin/profiles/:id`

**Headers**: `Authorization: Bearer <admin-token>`

**Test Case**:
```json
{
  "bio": "Updated bio",
  "location": "Updated location"
}
```

**Expected**: `200` with updated profile

---

#### 11. Suspend User Profile (Story #11)
**Endpoint**: `PUT /api/admin/profiles/:id/suspend`

**Headers**: `Authorization: Bearer <admin-token>`

**Test Case**:
```json
{
  "suspend": true,
  "reason": "Policy violation"
}
```

**Expected**: `200` with suspended profile

---

#### 12. Search User Profiles (Story #12)
**Endpoint**: `GET /api/admin/profiles/search?query=<search-term>`

**Headers**: `Authorization: Bearer <admin-token>`

**Expected**: `200` with matching profiles

---

## 🙋 PIN Endpoints

### Request Management

#### 15. Create Request (Story #15)
**Endpoint**: `POST /api/opportunities`

**Headers**: `Authorization: Bearer <pin-token>`

**Test Case**:
```json
{
  "title": "Need Help with Groceries",
  "description": "Looking for help with weekly grocery shopping",
  "categoryId": "category-id",
  "urgency": "MEDIUM",
  "location": "Downtown"
}
```

**Expected**: `201` with created request

---

#### 16. View My Requests (Story #16)
**Endpoint**: `GET /api/opportunities/my/requests`

**Headers**: `Authorization: Bearer <pin-token>`

**Expected**: `200` with user's requests

---

#### 17. Update Request (Story #17)
**Endpoint**: `PUT /api/opportunities/:id`

**Headers**: `Authorization: Bearer <pin-token>`

**Test Case**:
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Expected**: `200` with updated request

---

#### 18. Delete Request (Story #18)
**Endpoint**: `DELETE /api/opportunities/:id`

**Headers**: `Authorization: Bearer <pin-token>`

**Expected**: `200` with success message

---

#### 19. Search My Requests (Story #19)
**Endpoint**: `GET /api/opportunities/my/search?query=<search-term>`

**Headers**: `Authorization: Bearer <pin-token>`

**Expected**: `200` with matching requests

---

#### 20. View Request Views (Story #20)
**Endpoint**: `GET /api/opportunities/my/:id/views`

**Headers**: `Authorization: Bearer <pin-token>`

**Expected**: `200` with view count

---

#### 21. View Request Shortlists (Story #21)
**Endpoint**: `GET /api/opportunities/my/:id/shortlists`

**Headers**: `Authorization: Bearer <pin-token>`

**Expected**: `200` with shortlist count

---

#### 22. Search Completed Requests (Story #22)
**Endpoint**: `GET /api/volunteers/requests/history/search?query=<search-term>`

**Headers**: `Authorization: Bearer <pin-token>`

**Expected**: `200` with matching completed requests

---

#### 23. View Completed Requests (Story #23)
**Endpoint**: `GET /api/volunteers/requests/history`

**Headers**: `Authorization: Bearer <pin-token>`

**Expected**: `200` with completed requests

---

## 🤝 CSR Rep Endpoints

#### 26. Search Requests (Story #26)
**Endpoint**: `GET /api/opportunities/search?query=<search-term>`

**Headers**: `Authorization: Bearer <csr-token>`

**Expected**: `200` with matching requests

---

#### 27. View Requests (Story #27)
**Endpoints**:
- `GET /api/opportunities` - List all requests
- `GET /api/opportunities/:id` - Get specific request

**Headers**: `Authorization: Bearer <csr-token>`

**Expected**: `200` with request data

---

#### 28. Save Request (Story #28)
**Endpoint**: `POST /api/organizations/shortlist`

**Headers**: `Authorization: Bearer <csr-token>`

**Test Case**:
```json
{
  "requestId": "request-id-here"
}
```

**Expected**: `201` with shortlist entry

---

#### 29. Search Shortlist (Story #29)
**Endpoint**: `GET /api/organizations/shortlist/search?query=<search-term>`

**Headers**: `Authorization: Bearer <csr-token>`

**Expected**: `200` with matching shortlisted requests

---

#### 30. View Shortlist (Story #30)
**Endpoint**: `GET /api/organizations/shortlists`

**Headers**: `Authorization: Bearer <csr-token>`

**Expected**: `200` with shortlisted requests

---

#### 31. Search Completed Requests (Story #31)
**Endpoint**: `GET /api/organizations/requests/history/search?query=<search-term>`

**Headers**: `Authorization: Bearer <csr-token>`

**Expected**: `200` with matching completed requests

---

#### 32. View Completed Requests (Story #32)
**Endpoint**: `GET /api/organizations/requests/history`

**Headers**: `Authorization: Bearer <csr-token>`

**Expected**: `200` with completed requests

---

## 🧭 Platform Manager Endpoints

#### 35. Create Category (Story #35)
**Endpoint**: `POST /api/platform-manager/categories`

**Headers**: `Authorization: Bearer <manager-token>`

**Test Case**:
```json
{
  "name": "Food Assistance",
  "description": "Help with food and groceries",
  "iconUrl": "https://example.com/icon.png"
}
```

**Expected**: `201` with created category

---

#### 36. View Categories (Story #36)
**Endpoints**:
- `GET /api/platform-manager/categories` - List all categories
- `GET /api/platform-manager/categories/:id` - Get specific category

**Headers**: `Authorization: Bearer <manager-token>`

**Expected**: `200` with category data

---

#### 37. Update Category (Story #37)
**Endpoint**: `PUT /api/platform-manager/categories/:id`

**Headers**: `Authorization: Bearer <manager-token>`

**Test Case**:
```json
{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

**Expected**: `200` with updated category

---

#### 38. Delete Category (Story #38)
**Endpoint**: `DELETE /api/platform-manager/categories/:id`

**Headers**: `Authorization: Bearer <manager-token>`

**Expected**: `200` with success message

---

#### 39. Search Categories (Story #39)
**Endpoint**: `GET /api/platform-manager/categories/search?query=<search-term>`

**Headers**: `Authorization: Bearer <manager-token>`

**Expected**: `200` with matching categories

---

## 🧪 Automated Testing with Postman

### Import Collection

1. Create a new Postman collection: "CSR Matching System - Refactored"
2. Set up environment variables:
   ```
   baseUrl: http://localhost:5000/api
   adminToken: <get-from-login>
   pinToken: <get-from-login>
   csrToken: <get-from-login>
   managerToken: <get-from-login>
   ```

3. Add requests for each endpoint
4. Use tests to validate responses:

```javascript
// Example test script
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
});
```

---

## ✅ Testing Checklist

### Authentication
- [ ] Login for all user types works
- [ ] Logout works with valid token
- [ ] Invalid credentials are rejected
- [ ] Suspended users cannot login

### User Admin
- [ ] Can create user accounts
- [ ] Can view all users and specific user
- [ ] Can update user details
- [ ] Can suspend user accounts
- [ ] Can search users
- [ ] Can create user profiles
- [ ] Can view profiles
- [ ] Can update profiles
- [ ] Can suspend profiles
- [ ] Can search profiles

### PIN
- [ ] Can create requests
- [ ] Can view own requests
- [ ] Can update own requests
- [ ] Can delete own requests
- [ ] Can search own requests
- [ ] Can view request views count
- [ ] Can view request shortlists count
- [ ] Can search completed requests
- [ ] Can view completed requests

### CSR Rep
- [ ] Can search available requests
- [ ] Can view requests
- [ ] Can save requests to shortlist
- [ ] Can search shortlist
- [ ] Can view shortlist
- [ ] Can search completed requests
- [ ] Can view completed requests

### Platform Manager
- [ ] Can create categories
- [ ] Can view categories
- [ ] Can update categories
- [ ] Can delete categories
- [ ] Can search categories

---

## 🐛 Common Issues & Solutions

### Issue: 401 Unauthorized
- **Cause**: Missing or invalid token
- **Solution**: Ensure `Authorization: Bearer <token>` header is set

### Issue: 403 Forbidden
- **Cause**: User doesn't have required permissions
- **Solution**: Use correct user type token for the endpoint

### Issue: 404 Not Found
- **Cause**: Invalid ID or route
- **Solution**: Verify the ID exists and route is correct

### Issue: 500 Internal Server Error
- **Cause**: Server-side error
- **Solution**: Check server logs for details

---

## 📊 Test Results Template

Create a spreadsheet to track test results:

| Story | Endpoint | Method | Expected | Actual | Status | Notes |
|-------|----------|--------|----------|--------|--------|-------|
| #1 | /api/auth/login | POST | 200 | 200 | ✅ | Works |
| #15 | /api/opportunities | POST | 201 | 201 | ✅ | Works |
| ... | ... | ... | ... | ... | ... | ... |

---

## 🔄 Next Steps After Testing

1. ✅ Document any bugs found
2. ✅ Fix issues in controllers
3. ✅ Re-test fixed endpoints
4. ✅ Update documentation if needed
5. ✅ Proceed to delete old controllers safely

