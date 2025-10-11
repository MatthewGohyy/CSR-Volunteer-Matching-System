# API Documentation - CSR Volunteer Matching System

## Base URL
```
http://localhost:4000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register PIN (Person In Need)
```http
POST /api/auth/register/pin
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "age": 65,
  "location": "Singapore",
  "phoneNumber": "+65 9123 4567",
  "accessibilityNeeds": "Wheelchair accessible"
}
```

**Response:**
```json
{
  "message": "PIN registered successfully",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "userType": "PIN",
    "profile": { ... }
  },
  "token": "jwt_token"
}
```

### Register CSR Representative
```http
POST /api/auth/register/csr-rep
```

**Body:**
```json
{
  "email": "rep@company.com",
  "password": "SecurePass123",
  "companyName": "TechCorp Pte Ltd",
  "companyRegistrationNumber": "202012345A",
  "industry": "Technology",
  "contactPerson": "Jane Smith",
  "phoneNumber": "+65 6123 4567",
  "companyAddress": "123 Business Street, Singapore"
}
```

**Response:**
```json
{
  "message": "CSR Representative registered successfully. Pending admin approval.",
  "user": {
    "id": "uuid",
    "email": "rep@company.com",
    "userType": "CSR_REP",
    "profile": { ... }
  },
  "token": "jwt_token"
}
```

### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "userType": "PIN",
    "profile": { ... }
  },
  "token": "jwt_token"
}
```

### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Update Password
```http
PUT /api/auth/password
Authorization: Bearer <token>
```

**Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

---

## 📋 Opportunity/Request Endpoints

### Get All Service Categories
```http
GET /api/opportunities/categories
```

**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Medical",
      "description": "Medical appointments, healthcare support",
      "isActive": true
    }
  ]
}
```

### Get All Requests
```http
GET /api/opportunities?status=ACTIVE&urgency=HIGH&page=1&limit=10
```

**Query Parameters:**
- `status`: ACTIVE, MATCHED, COMPLETED, CANCELLED
- `urgency`: LOW, MEDIUM, HIGH
- `categoryId`: UUID
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response:**
```json
{
  "requests": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### Get Single Request
```http
GET /api/opportunities/:id
```

### Create Request (PIN only)
```http
POST /api/opportunities
Authorization: Bearer <token>
```

**Body:**
```json
{
  "categoryId": "uuid",
  "title": "Need help with grocery shopping",
  "description": "Weekly grocery shopping assistance needed",
  "urgency": "MEDIUM",
  "dateNeeded": "2024-12-25",
  "location": "Jurong West, Singapore"
}
```

### Get My Requests (PIN only)
```http
GET /api/opportunities/my/requests
Authorization: Bearer <token>
```

### Update Request (PIN only)
```http
PUT /api/opportunities/:id
Authorization: Bearer <token>
```

### Delete Request (PIN only)
```http
DELETE /api/opportunities/:id
Authorization: Bearer <token>
```

---

## 👤 PIN (Volunteer) Endpoints

All endpoints require PIN authentication.

### Get Profile
```http
GET /api/volunteers/profile
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /api/volunteers/profile
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "John Doe",
  "age": 66,
  "location": "Singapore",
  "phoneNumber": "+65 9123 4567",
  "accessibilityNeeds": "Wheelchair accessible",
  "profilePhoto": "url_to_photo"
}
```

### Get My Matches
```http
GET /api/volunteers/matches
Authorization: Bearer <token>
```

### Get Notifications
```http
GET /api/volunteers/notifications
Authorization: Bearer <token>
```

### Mark Notification as Read
```http
PUT /api/volunteers/notifications/:notificationId/read
Authorization: Bearer <token>
```

### Mark All Notifications as Read
```http
PUT /api/volunteers/notifications/read-all
Authorization: Bearer <token>
```

---

## 🏢 Organization (CSR Rep) Endpoints

All endpoints require CSR Rep authentication.

### Shortlist a Request
```http
POST /api/organizations/shortlist
Authorization: Bearer <token>
```

**Body:**
```json
{
  "requestId": "uuid"
}
```

### Remove from Shortlist
```http
DELETE /api/organizations/shortlist/:requestId
Authorization: Bearer <token>
```

### Get Shortlisted Requests
```http
GET /api/organizations/shortlists
Authorization: Bearer <token>
```

### Submit Volunteer Offer
```http
POST /api/organizations/offers
Authorization: Bearer <token>
```

**Body:**
```json
{
  "requestId": "uuid",
  "message": "We would like to help with this request. Our team is available next week."
}
```

### Get My Offers
```http
GET /api/organizations/offers
Authorization: Bearer <token>
```

### Get My Matches
```http
GET /api/organizations/matches
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /api/organizations/profile
Authorization: Bearer <token>
```

**Body:**
```json
{
  "industry": "Technology",
  "contactPerson": "Jane Smith",
  "phoneNumber": "+65 6123 4567",
  "companyAddress": "123 Business Street",
  "companyLogo": "url_to_logo"
}
```

---

## 🤝 Match Endpoints

### Get Offers for My Requests (PIN only)
```http
GET /api/matches/offers
Authorization: Bearer <token>
```

### Accept Offer (PIN only)
```http
POST /api/matches/offers/:offerId/accept
Authorization: Bearer <token>
```

### Decline Offer (PIN only)
```http
POST /api/matches/offers/:offerId/decline
Authorization: Bearer <token>
```

### Complete Match
```http
PUT /api/matches/:matchId/complete
Authorization: Bearer <token>
```

**Note:** Both PIN and CSR Rep can mark a match as complete.

### Cancel Match
```http
PUT /api/matches/:matchId/cancel
Authorization: Bearer <token>
```

**Body:**
```json
{
  "reason": "Unable to proceed due to scheduling conflict"
}
```

**Note:** Both PIN and CSR Rep can cancel a match.

---

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## 🔄 Enums

### UserType
- `PIN` - Person In Need
- `CSR_REP` - CSR Representative
- `ADMIN` - Administrator

### UserStatus
- `ACTIVE` - Account is active
- `PENDING` - Pending approval
- `SUSPENDED` - Temporarily suspended
- `DEACTIVATED` - Permanently deactivated

### RequestStatus
- `ACTIVE` - Available for offers
- `MATCHED` - Matched with a volunteer
- `COMPLETED` - Help provided
- `CANCELLED` - Cancelled by PIN

### UrgencyLevel
- `LOW` - Can wait
- `MEDIUM` - Within a week
- `HIGH` - Urgent, ASAP

### OfferStatus
- `PENDING` - Awaiting PIN response
- `ACCEPTED` - Accepted by PIN
- `DECLINED` - Declined by PIN

### MatchStatus
- `ACTIVE` - Ongoing
- `COMPLETED` - Successfully completed
- `CANCELLED` - Cancelled by either party

---

## 🔔 Notification Types

- `VOLUNTEER_OFFER` - New offer received
- `OFFER_ACCEPTED` - Your offer was accepted
- `OFFER_DECLINED` - Your offer was declined
- `MATCH_CONFIRMED` - Match confirmed
- `MATCH_CANCELLED` - Match cancelled
- `REQUEST_UPDATED` - Request was updated

---

## 📝 Example Workflow

### For PIN (Person In Need):
1. Register as PIN: `POST /api/auth/register/pin`
2. Create a request: `POST /api/opportunities`
3. View offers: `GET /api/matches/offers`
4. Accept an offer: `POST /api/matches/offers/:offerId/accept`
5. View match details: `GET /api/volunteers/matches`
6. Mark as complete: `PUT /api/matches/:matchId/complete`

### For CSR Rep:
1. Register as CSR Rep: `POST /api/auth/register/csr-rep`
2. Browse requests: `GET /api/opportunities`
3. Shortlist interesting requests: `POST /api/organizations/shortlist`
4. Submit offer: `POST /api/organizations/offers`
5. Wait for acceptance
6. View matches: `GET /api/organizations/matches`
7. Mark as complete: `PUT /api/matches/:matchId/complete`

---

## 🛡️ Error Response Format

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

---

## 🧪 Testing

Use these test credentials after running the seed:

**Admin:**
- Email: `admin@csr.com`
- Password: `admin123`

**Test with cURL:**
```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@csr.com","password":"admin123"}'

# Get categories
curl http://localhost:4000/api/opportunities/categories

# Get requests (with auth)
curl http://localhost:4000/api/opportunities \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Test with Postman:**
1. Import the API collection
2. Set base URL: `http://localhost:4000/api`
3. For protected routes, add token in Authorization > Bearer Token

---

## 📚 Additional Resources

- [Database Schema Documentation](DATABASE.md)
- [Setup Guide](SETUP.md)
- [Quick Start](QUICKSTART.md)

