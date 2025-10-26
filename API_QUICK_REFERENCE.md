# 🚀 API Quick Reference

**Base URL:** `http://localhost:4000/api`

---

## 🔐 Authentication

```
POST   /auth/register/pin       - Register PIN
POST   /auth/register/csr-rep   - Register CSR Rep
POST   /auth/login              - Login (all types)
POST   /auth/logout             - Logout (Auth)
GET    /auth/profile            - Get profile (Auth)
PUT    /auth/password           - Update password (Auth)
```

---

## 🧑‍💼 Admin - `/admin` (Admin Only)

### User Accounts
```
GET    /admin/users                - List users
GET    /admin/users/search         - Search users
GET    /admin/users/:id            - Get user by ID
POST   /admin/users                - Create user
PUT    /admin/users/:id            - Update user
PUT    /admin/users/:id/status     - Update status
PUT    /admin/users/:id/suspend    - Suspend user
PUT    /admin/users/:id/activate   - Activate user
DELETE /admin/users/:id            - Delete user
```

### User Profiles
```
GET    /admin/profiles             - List profiles
GET    /admin/profiles/search      - Search profiles
GET    /admin/profiles/:id         - Get profile by ID
POST   /admin/profiles             - Create profile
PUT    /admin/profiles/:id         - Update profile
PUT    /admin/profiles/:id/suspend - Suspend profile
PUT    /admin/profiles/:id/activate- Activate profile
```

### Stats
```
GET    /admin/stats                - System statistics
```

---

## 👥 PIN - `/volunteers` (PIN Only)

```
GET    /volunteers/profile                      - Get profile
PUT    /volunteers/profile                      - Update profile
GET    /volunteers/matches                      - Get matches
GET    /volunteers/notifications                - Get notifications
PUT    /volunteers/notifications/:id/read       - Mark read
PUT    /volunteers/notifications/read-all       - Mark all read
GET    /volunteers/requests/history             - View history
GET    /volunteers/requests/history/search      - Search history
```

---

## 🏢 CSR Rep - `/organizations` (CSR Rep Only)

### Shortlist
```
POST   /organizations/shortlist                - Add to shortlist
GET    /organizations/shortlists               - View shortlist
GET    /organizations/shortlist/search         - Search shortlist
DELETE /organizations/shortlist/:requestId     - Remove from shortlist
```

### Offers & Matches
```
POST   /organizations/offers                   - Submit offer
GET    /organizations/offers                   - View offers
GET    /organizations/matches                  - View matches
```

### History & Profile
```
GET    /organizations/requests/history         - View history
GET    /organizations/requests/history/search  - Search history
PUT    /organizations/profile                  - Update profile
```

---

## 🧭 Platform Manager - `/platform-manager` (PM Only)

### Categories
```
GET    /platform-manager/categories            - List categories
GET    /platform-manager/categories/:id        - Get category
GET    /platform-manager/categories/search     - Search categories
POST   /platform-manager/categories            - Create category
PUT    /platform-manager/categories/:id        - Update category
DELETE /platform-manager/categories/:id        - Delete category
```

### Stats & Profile
```
GET    /platform-manager/stats                 - Platform stats
GET    /platform-manager/profile               - Get profile
PUT    /platform-manager/profile               - Update profile
```

---

## 📋 Opportunities - `/opportunities`

### Public
```
GET    /opportunities/categories               - Get categories
```

### CSR Rep - Browse Requests
```
GET    /opportunities                          - List requests
GET    /opportunities/:id                      - Get request
GET    /opportunities/search                   - Search requests
```

### PIN - My Requests
```
POST   /opportunities                          - Create request
PUT    /opportunities/:id                      - Update request
DELETE /opportunities/:id                      - Delete request
GET    /opportunities/my/requests              - List my requests
GET    /opportunities/my/search                - Search my requests
GET    /opportunities/my/:id/views             - View count
GET    /opportunities/my/:id/shortlists        - Shortlist count
```

---

## 🤝 Matches - `/matches`

### PIN - Manage Offers
```
GET    /matches/offers                - Get offers for my requests
POST   /matches/offers/:id/accept     - Accept offer
POST   /matches/offers/:id/decline    - Decline offer
```

### Both PIN & CSR Rep
```
PUT    /matches/:id/complete          - Complete match
PUT    /matches/:id/cancel            - Cancel match
```

---

## 🧪 Quick Test Commands

```bash
# Health check
curl http://localhost:4000/health

# Get categories (public)
curl http://localhost:4000/api/opportunities/categories

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@csr.com","password":"admin123"}'

# Get profile (with token)
curl http://localhost:4000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Common Query Parameters

```
?page=1              - Page number
?limit=10            - Items per page
?q=search            - Search query
?status=ACTIVE       - Filter by status
?urgency=HIGH        - Filter by urgency
?userType=PIN        - Filter by user type
?categoryId=uuid     - Filter by category
```

---

## 🔢 Response Status Codes

| Code | Meaning |
|------|---------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 409  | Conflict |
| 500  | Server Error |

---

**Tip:** See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed request/response examples.
