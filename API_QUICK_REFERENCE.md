# 🚀 API Quick Reference

**Base URL:** `http://localhost:4000/api`

---

## 🔐 Authentication

```
POST   /auth/register/pin       - Register Person In Need
POST   /auth/register/csr-rep   - Register CSR Representative  
POST   /auth/login              - Login
GET    /auth/profile            - Get profile (Auth)
PUT    /auth/password           - Update password (Auth)
```

---

## 📝 Requests/Opportunities

```
GET    /opportunities/categories       - Get all categories
GET    /opportunities                  - Get all requests
GET    /opportunities/:id              - Get single request
POST   /opportunities                  - Create request (PIN)
GET    /opportunities/my/requests      - Get my requests (PIN)
PUT    /opportunities/:id              - Update request (PIN)
DELETE /opportunities/:id              - Delete request (PIN)
```

---

## 🏢 CSR Representative

```
POST   /organizations/shortlist                - Shortlist request
DELETE /organizations/shortlist/:requestId     - Remove shortlist
GET    /organizations/shortlists               - Get shortlisted
POST   /organizations/offers                   - Submit offer
GET    /organizations/offers                   - Get my offers
GET    /organizations/matches                  - Get my matches
PUT    /organizations/profile                  - Update profile
```

---

## 👥 Person In Need (PIN)

```
GET    /volunteers/profile                      - Get my profile
PUT    /volunteers/profile                      - Update profile
GET    /volunteers/matches                      - Get my matches
GET    /volunteers/notifications                - Get notifications
PUT    /volunteers/notifications/:id/read       - Mark read
PUT    /volunteers/notifications/read-all       - Mark all read
```

---

## 🤝 Matching

```
GET    /matches/offers              - Get offers for my requests (PIN)
POST   /matches/offers/:id/accept   - Accept offer (PIN)
POST   /matches/offers/:id/decline  - Decline offer (PIN)
PUT    /matches/:id/complete        - Complete match
PUT    /matches/:id/cancel          - Cancel match
```

---

## 🧪 Quick Test

```bash
# Health check
curl http://localhost:4000/health

# Get categories
curl http://localhost:4000/api/opportunities/categories

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@csr.com","password":"admin123"}'
```

---

## 📚 Full Documentation

See **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** for complete details including:
- Request/response examples
- Error codes
- Authentication details
- Full payload examples

