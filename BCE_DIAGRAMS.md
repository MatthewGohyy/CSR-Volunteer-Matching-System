# BCE Diagrams - CSR Volunteer Matching System

## Overview
This document contains BCE (Boundary-Control-Entity) diagrams for our main features, showing the flow from API routes → Controller logic → Database entities.

---

## 1. User Registration (PIN)

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│      auth_registrationPage          │     │       AuthController                 │     │          UserEntity                 │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ Route: POST /api/auth/register/pin │     │ +async registerPIN(                  │     │ model User {                        │
│                                     │     │    email: string,                    │     │   id: string                        │
│ +validate(registerPINValidation)    │     │    password: string,                 │     │   email: string @unique             │
│                                     │     │    name: string,                     │     │   password: string                  │
│ +send_to_controller()               │     │    age: int,                         │     │   userType: UserType                │
│                                     │     │    location: string,                 │     │   status: UserStatus                │
│ +return_JSON_response()             │     │    phoneNumber: string,              │     │   pin: PIN                          │
│   - 201: Success with token         │     │    accessibilityNeeds: string        │     │   csrRep: CSRRep                    │
│   - 409: Email exists               │     │  ): Promise<Response>                │     │   createdAt: DateTime               │
│   - 400: Validation error           │     │                                      │     │ }                                   │
│                                     │     │ // Business Logic:                   │     │                                     │
│                                     │     │ +check_existing_user()               │     │ model PIN {                         │
│                                     │     │ +hash_password()                     │     │   id: string                        │
│                                     │     │ +create_user_and_profile()           │     │   userId: string @unique            │
│                                     │     │ +generate_jwt_token()                │     │   name: string                      │
│                                     │     │ +format_response()                   │     │   age: int                          │
│                                     │     │                                      │     │   location: string                  │
│                                     │     │ // Error Handling:                   │     │   phoneNumber: string               │
│                                     │     │ +throw AppError (409)                │     │   accessibilityNeeds: string        │
│                                     │     │   if email exists                    │     │   user: User                        │
│                                     │     │                                      │     │   requests: Request[]               │
│                                     │     │                                      │     │   matches: Match[]                  │
│                                     │     │                                      │     │ }                                   │
└─────────────────────────────────────┘     └──────────────────────────────────────┘     └─────────────────────────────────────┘
         ↑                                              ↑                                             ↑
         │                                              │                                             │
    API Endpoint                                 Business Logic                                Database Model
```

---

## 2. User Login

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│         auth_loginPage              │     │       AuthController                 │     │          UserEntity                 │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ Route: POST /api/auth/login         │     │ +async login(                        │     │ model User {                        │
│                                     │     │    email: string,                    │     │   id: string                        │
│ +validate(loginValidation)          │     │    password: string                  │     │   email: string @unique             │
│                                     │     │  ): Promise<Response>                │     │   password: string (hashed)         │
│ +send_to_controller()               │     │                                      │     │   userType: UserType                │
│                                     │     │ // Business Logic:                   │     │   status: UserStatus                │
│ +return_JSON_response()             │     │ +find_user_by_email()                │     │   pin: PIN                          │
│   - 200: Success with token         │     │ +check_user_status()                 │     │   csrRep: CSRRep                    │
│   - 401: Invalid credentials        │     │ +verify_password()                   │     │ }                                   │
│   - 403: Account inactive           │     │ +check_approval_status()             │     │                                     │
│   - 403: Pending approval           │     │ +generate_jwt_token()                │     │ Relationships:                      │
│                                     │     │ +format_response()                   │     │   User ← PIN (one-to-one)           │
│                                     │     │                                      │     │   User ← CSRRep (one-to-one)        │
│                                     │     │ // Error Handling:                   │     │                                     │
│                                     │     │ +throw AppError (401)                │     │ Query:                              │
│                                     │     │   if credentials invalid             │     │   findUnique({ email })             │
│                                     │     │ +throw AppError (403)                │     │   include: { pin, csrRep }          │
│                                     │     │   if account not active              │     │                                     │
└─────────────────────────────────────┘     └──────────────────────────────────────┘     └─────────────────────────────────────┘
```

---

## 3. Create Help Request (PIN)

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│    opportunities_createPage         │     │      RequestController               │     │        RequestEntity                │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ Route: POST /api/opportunities      │     │ +async createRequest(                │     │ model Request {                     │
│                                     │     │    categoryId: string,               │     │   id: string                        │
│ +authenticate()                     │     │    title: string,                    │     │   pinId: string                     │
│ +authorize([UserType.PIN])          │     │    description: string,              │     │   categoryId: string                │
│ +validate(createRequestValidation)  │     │    urgency: UrgencyLevel,            │     │   title: string                     │
│                                     │     │    dateNeeded: Date,                 │     │   description: string               │
│ +send_to_controller()               │     │    location: string                  │     │   urgency: UrgencyLevel             │
│                                     │     │  ): Promise<Response>                │     │   dateNeeded: DateTime              │
│ +return_JSON_response()             │     │                                      │     │   location: string                  │
│   - 201: Request created            │     │ // Business Logic:                   │     │   status: RequestStatus             │
│   - 404: PIN not found              │     │ +get_user_id_from_token()            │     │   viewCount: int                    │
│   - 401: Unauthorized               │     │ +find_pin_profile()                  │     │   createdAt: DateTime               │
│   - 400: Validation error           │     │ +validate_category_exists()          │     │   updatedAt: DateTime               │
│                                     │     │ +create_request_with_defaults()      │     │                                     │
│                                     │     │ +set_status_ACTIVE()                 │     │   pin: PIN                          │
│                                     │     │ +include_related_data()              │     │   category: ServiceCategory         │
│                                     │     │ +format_response()                   │     │   volunteerOffers: VolunteerOffer[] │
│                                     │     │                                      │     │   shortlists: Shortlist[]           │
│                                     │     │ // Error Handling:                   │     │   match: Match                      │
│                                     │     │ +throw AppError (404)                │     │ }                                   │
│                                     │     │   if PIN profile not found           │     │                                     │
│                                     │     │                                      │     │ enum UrgencyLevel {                 │
│                                     │     │                                      │     │   LOW, MEDIUM, HIGH, CRITICAL       │
│                                     │     │                                      │     │ }                                   │
└─────────────────────────────────────┘     └──────────────────────────────────────┘     └─────────────────────────────────────┘
```

---

## 4. View Requests (Browse)

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│    opportunities_browsePage         │     │      RequestController               │     │        RequestEntity                │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ Route: GET /api/opportunities       │     │ +async getRequests(                  │     │ model Request {                     │
│                                     │     │    status?: RequestStatus,           │     │   // All fields from above          │
│ Query Parameters:                   │     │    urgency?: UrgencyLevel,           │     │ }                                   │
│   ?status=ACTIVE                    │     │    categoryId?: string,              │     │                                     │
│   &urgency=HIGH                     │     │    page: number = 1,                 │     │ model ServiceCategory {             │
│   &categoryId=uuid                  │     │    limit: number = 10                │     │   id: string                        │
│   &page=1                           │     │  ): Promise<Response>                │     │   name: string                      │
│   &limit=10                         │     │                                      │     │   description: string               │
│                                     │     │ // Business Logic:                   │     │   iconName: string                  │
│ +send_to_controller()               │     │ +parse_query_parameters()            │     │   isActive: boolean                 │
│                                     │     │ +build_where_clause()                │     │   requests: Request[]               │
│ +return_JSON_response()             │     │ +calculate_pagination()              │     │ }                                   │
│   - 200: Array of requests          │     │ +fetch_requests_with_relations()     │     │                                     │
│   - 200: Pagination metadata        │     │ +count_total_requests()              │     │ model PIN {                         │
│                                     │     │ +include_category_and_pin()          │     │   // All fields from above          │
│                                     │     │ +order_by_createdAt_desc()           │     │   // name, location exposed         │
│                                     │     │ +format_response_with_pagination()   │     │ }                                   │
│                                     │     │                                      │     │                                     │
│                                     │     │ Response includes:                   │     │ Query:                              │
│                                     │     │   requests: Array                    │     │   findMany({                        │
│                                     │     │   pagination: {                      │     │     where,                          │
│                                     │     │     page, limit, total, pages         │     │     include: { category, pin },     │
│                                     │     │   }                                  │     │     orderBy: { createdAt: 'desc' }  │
│                                     │     │                                      │     │   })                                │
└─────────────────────────────────────┘     └──────────────────────────────────────┘     └─────────────────────────────────────┘
```

---

## 5. Register CSR Representative

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│    csr_registrationPage             │     │       AuthController                 │     │       User + CSRRepEntity           │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ Route: POST                         │     │ +async registerCSRRep(               │     │ model User {                        │
│   /api/auth/register/csr-rep        │     │    email: string,                    │     │   // Same as above                  │
│                                     │     │    password: string,                 │     │ }                                   │
│ +validate(registerCSRRepValidation) │     │    companyName: string,              │     │                                     │
│                                     │     │    companyRegistrationNumber: string,│     │ model CSRRep {                      │
│ +send_to_controller()               │     │    industry: string,                 │     │   id: string                        │
│                                     │     │    contactPerson: string,            │     │   userId: string @unique            │
│ +return_JSON_response()             │     │    phoneNumber: string,              │     │   companyName: string               │
│   - 201: Success (pending approval) │     │    companyAddress: string            │     │   companyRegistrationNumber: string │
│   - 409: Email exists               │     │  ): Promise<Response>                │     │   industry: string                  │
│   - 409: Company reg exists         │     │                                      │     │   contactPerson: string             │
│                                     │     │ // Business Logic:                   │     │   phoneNumber: string               │
│                                     │     │ +check_existing_email()              │     │   companyAddress: string            │
│                                     │     │ +check_company_reg_number()          │     │   approvalStatus: UserStatus        │
│                                     │     │ +hash_password()                     │     │   certifications: string            │
│                                     │     │ +create_user_and_csr_profile()       │     │   createdAt: DateTime               │
│                                     │     │ +set_approval_PENDING()              │     │                                     │
│                                     │     │ +generate_jwt_token()                │     │   user: User                        │
│                                     │     │ +format_response()                   │     │   volunteerOffers: VolunteerOffer[] │
│                                     │     │                                      │     │   matches: Match[]                  │
│                                     │     │ // Error Handling:                   │     │   shortlists: Shortlist[]           │
│                                     │     │ +throw AppError (409)                │     │ }                                   │
│                                     │     │   if email or reg number exists      │     │                                     │
└─────────────────────────────────────┘     └──────────────────────────────────────┘     └─────────────────────────────────────┘
```

---

## 6. Get User Profile

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│       profile_viewPage              │     │       AuthController                 │     │          UserEntity                 │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ Route: GET /api/auth/profile        │     │ +async getProfile(                   │     │ model User {                        │
│                                     │     │    // userId from JWT token          │     │   id: string                        │
│ +authenticate()                     │     │  ): Promise<Response>                │     │   email: string                     │
│   ↓ extracts JWT                    │     │                                      │     │   userType: UserType                │
│   ↓ verifies token                  │     │ // Business Logic:                   │     │   status: UserStatus                │
│   ↓ attaches user to request        │     │ +get_user_id_from_jwt()              │     │   pin: PIN                          │
│                                     │     │ +find_user_by_id()                   │     │   csrRep: CSRRep                    │
│ +send_to_controller()               │     │ +include_profile_based_on_type()     │     │   createdAt: DateTime               │
│                                     │     │ +remove_password_from_response()     │     │ }                                   │
│ +return_JSON_response()             │     │ +format_response()                   │     │                                     │
│   - 200: User with profile          │     │                                      │     │ Query:                              │
│   - 404: User not found             │     │ // Error Handling:                   │     │   findUnique({                      │
│   - 401: Invalid/expired token      │     │ +throw AppError (404)                │     │     where: { id: userId },          │
│                                     │     │   if user not found                  │     │     include: { pin, csrRep }        │
│                                     │     │                                      │     │   })                                │
└─────────────────────────────────────┘     └──────────────────────────────────────┘     └─────────────────────────────────────┘
```

---

## 7. Update Request (PIN)

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│   opportunities_editPage            │     │      RequestController               │     │        RequestEntity                │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ Route: PUT /api/opportunities/:id   │     │ +async updateRequest(                │     │ model Request {                     │
│                                     │     │    requestId: string,                │     │   id: string                        │
│ +authenticate()                     │     │    title?: string,                   │     │   pinId: string                     │
│ +authorize([UserType.PIN])          │     │    description?: string,             │     │   title: string                     │
│ +validate(updateRequestValidation)  │     │    urgency?: UrgencyLevel,           │     │   description: string               │
│                                     │     │    dateNeeded?: Date,                │     │   urgency: UrgencyLevel             │
│ +send_to_controller()               │     │    location?: string,                │     │   status: RequestStatus             │
│                                     │     │    status?: RequestStatus            │     │   updatedAt: DateTime               │
│ +return_JSON_response()             │     │  ): Promise<Response>                │     │   // ... other fields               │
│   - 200: Request updated            │     │                                      │     │ }                                   │
│   - 404: Request not found          │     │ // Business Logic:                   │     │                                     │
│   - 403: Not authorized             │     │ +get_user_id_from_token()            │     │ Validation:                         │
│   - 400: Validation error           │     │ +find_pin_profile()                  │     │   Check pinId matches owner         │
│                                     │     │ +find_existing_request()             │     │                                     │
│                                     │     │ +verify_ownership()                  │     │ Update:                             │
│                                     │     │ +validate_request_belongs_to_pin()   │     │   update({                          │
│                                     │     │ +update_only_provided_fields()       │     │     where: { id },                  │
│                                     │     │ +include_category_in_response()      │     │     data: { /* fields */ }          │
│                                     │     │ +format_response()                   │     │   })                                │
│                                     │     │                                      │     │                                     │
│                                     │     │ // Error Handling:                   │     │                                     │
│                                     │     │ +throw AppError (404)                │     │                                     │
│                                     │     │   if request not found               │     │                                     │
│                                     │     │ +throw AppError (403)                │     │                                     │
│                                     │     │   if not owner                       │     │                                     │
└─────────────────────────────────────┘     └──────────────────────────────────────┘     └─────────────────────────────────────┘
```

---

## 8. Update Password

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│    profile_changePasswordPage       │     │       AuthController                 │     │          UserEntity                 │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ Route: PUT /api/auth/password       │     │ +async updatePassword(               │     │ model User {                        │
│                                     │     │    currentPassword: string,          │     │   id: string                        │
│ +authenticate()                     │     │    newPassword: string               │     │   password: string (hashed)         │
│ +validate(updatePasswordValidation) │     │  ): Promise<Response>                │     │   updatedAt: DateTime               │
│                                     │     │                                      │     │ }                                   │
│ +send_to_controller()               │     │ // Business Logic:                   │     │                                     │
│                                     │     │ +get_user_id_from_token()            │     │ Update:                             │
│ +return_JSON_response()             │     │ +find_user_by_id()                   │     │   update({                          │
│   - 200: Password updated           │     │ +verify_current_password()           │     │     where: { id: userId },          │
│   - 401: Current password wrong     │     │ +validate_password_strength()        │     │     data: {                         │
│   - 404: User not found             │     │ +hash_new_password()                 │     │       password: hashedPassword      │
│   - 400: Validation error           │     │ +update_password_in_database()       │     │     }                               │
│                                     │     │ +format_response()                   │     │   })                                │
│                                     │     │                                      │     │                                     │
│                                     │     │ // Error Handling:                   │     │ Password Handling:                  │
│                                     │     │ +throw AppError (404)                │     │   - Hashed with bcrypt              │
│                                     │     │   if user not found                  │     │   - Salt rounds: 10                 │
│                                     │     │ +throw AppError (401)                │     │   - Never returned in responses     │
│                                     │     │   if current password incorrect      │     │                                     │
└─────────────────────────────────────┘     └──────────────────────────────────────┘     └─────────────────────────────────────┘
```

---

## Pattern Summary

### Common Flow Across All Features:

```
1. BOUNDARY (routes/)
   ├─ Define HTTP endpoint (GET, POST, PUT, DELETE)
   ├─ Apply middleware (authenticate, authorize, validate)
   └─ Route to controller method

2. CONTROL (controllers/)
   ├─ Extract data from request
   ├─ Apply business rules & validation
   ├─ Coordinate with Entity layer (database)
   ├─ Handle errors
   └─ Format response

3. ENTITY (prisma/schema.prisma)
   ├─ Define data structure (models)
   ├─ Define relationships
   ├─ Handle database queries
   └─ Return data to Control layer
```

### Middleware Flow (Applied at Boundary):

```
Request → authenticate() → authorize() → validate() → controller()
            ↓                  ↓              ↓            ↓
         Verify JWT      Check role      Check input    Execute
                                                       business logic
```

---

## Key Observations

### 1. **Separation of Concerns**
- **Boundary**: Only handles HTTP, routing, and basic validation
- **Control**: Contains all business logic and coordination
- **Entity**: Pure data models with relationships

### 2. **Middleware as Part of Boundary**
- `authenticate`: Verifies JWT token
- `authorize`: Checks user role/permissions
- `validate`: Validates request data against schema

### 3. **Error Handling**
- Errors thrown in Control layer
- Caught by error handler middleware (Boundary)
- Consistent error response format

### 4. **Data Flow**
```
Client Request
    ↓
Boundary (Route) → Middleware → Controller
    ↓                               ↓
Control (Business Logic) ← → Entity (Prisma Query)
    ↓                               ↓
Boundary (Response) ← Format ← Database
    ↓
Client Response
```

### 5. **Security Layers**
- JWT authentication at Boundary
- Role-based authorization at Boundary
- Ownership verification at Control
- Input validation at Boundary
- SQL injection prevention (Prisma ORM)

---

## Usage Guide

### When Adding New Features:

1. **Start with Entity**: Define your data model in `schema.prisma`
2. **Add Control**: Create controller with business logic
3. **Wire up Boundary**: Add route with proper middleware
4. **Add Validation**: Create validation schema if needed
5. **Test**: Ensure all three layers work together

### Debugging Guide:

| Issue | Check Layer |
|-------|-------------|
| Endpoint not found | Boundary (routes/) |
| Validation error | Boundary (validators/) |
| Business logic error | Control (controllers/) |
| Database error | Entity (schema.prisma) |
| Authentication error | Boundary (middleware/auth) |
| Authorization error | Boundary (middleware/auth) |

---

## Related Documentation

- **Full BCE Details**: See `BCE_ARCHITECTURE.md`
- **Simple Guide**: See `BCE_SIMPLE_GUIDE.md`
- **Presentation**: See `BCE_PRESENTATION.md`
- **API Reference**: See `API_DOCUMENTATION.md`
- **Database Schema**: See `DATABASE.md`

---

**Created for CSIT314 Project | Last Updated: October 2025**

