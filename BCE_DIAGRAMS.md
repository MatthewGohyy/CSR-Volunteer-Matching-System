# BCE Diagrams - CSR Volunteer Matching System
## Classical Boundary-Control-Entity Architecture

## Overview
This document contains **Classical BCE diagrams** for our main features, showing the flow from **Frontend UI (Boundary)** → **Backend Logic (Control)** → **Database Models (Entity)**.

> **📝 Note**: These diagrams follow the classical/academic BCE interpretation, appropriate for academic reports and documentation.

---

## 1. User Registration (PIN)

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│     RegisterPage.tsx                │     │      AuthController                  │     │   UserAccountEntity + PIN           │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
│      Frontend - React               │     │       Backend - Node.js              │     │      Database - Prisma              │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ UI Component:                       │     │ API Endpoint:                        │     │ model UserAccount {                 │
│   +form inputs (email, password,    │     │   POST /api/auth/register/pin        │     │   id: string                        │
│    name, age, location)             │     │                                      │     │   email: string @unique             │
│                                     │     │ +async registerPIN(                  │     │   password: string                  │
│ API Call:                           │     │    email: string,                    │     │   name: string                      │
│   +authService.registerPIN(data)    │     │    password: string,                 │     │   phoneNumber: string               │
│                                     │     │    name: string,                     │     │   status: UserStatus                │
│ User Actions:                       │     │    age: int,                         │     │   userProfileId: string             │
│   +fill_form()                      │     │    location: string,                 │     │   userProfile: UserProfile          │
│   +click_register_button()          │     │    phoneNumber: string,              │     │   pin: PIN                          │
│   +display_success_message()        │     │    accessibilityNeeds: string        │     │   csrRep: CSRRep                    │
│   +navigate_to_dashboard()          │     │  ): Promise<Response>                │     │ }                                   │
│                                     │     │                                      │     │                                     │
│ HTTP Request:                       │     │ // Business Logic:                   │     │ model UserProfile {                 │
│   POST with JSON body               │     │ +check_existing_user()               │     │   id: string                        │
│   Headers: Content-Type             │     │ +validate_input_data()               │     │   role: UserProfileRole @unique     │
│                                     │     │ +hash_password()                     │     │   name: string                      │
│ Response Handling:                  │     │ +get_pin_profile_id()                │     │   // 4 static records (PIN,         │
│   - 201: Store token, redirect     │     │ +create_account_and_profile()        │     │   //  CSR_REP, USER_ADMIN,          │
│   - 409: Show "Email exists" error  │     │ +generate_jwt_token()                │     │   //  PLATFORM_MANAGER)             │
│   - 400: Show validation errors     │     │ +format_response()                   │     │ }                                   │
│                                     │     │                                      │     │                                     │
│                                     │     │ // Error Handling:                   │     │ model PIN {                         │
│                                     │     │ +throw AppError (409)                │     │   id: string                        │
│                                     │     │   if email exists                    │     │   userAccountId: string @unique     │
│                                     │     │ +throw AppError (400)                │     │   name: string                      │
│                                     │     │   if validation fails                │     │   age: int                          │
│                                     │     │                                      │     │   location: string                  │
│                                     │     │ HTTP Response:                       │     │   phoneNumber: string               │
│                                     │     │   JSON with user data + JWT token    │     │   accessibilityNeeds: string        │
│                                     │     │                                      │     │   userAccount: UserAccount          │
│                                     │     │                                      │     │ }                                   │
│                                     │     │                                      │     │                                     │
│                                     │     │                                      │     │ Relationships:                      │
│                                     │     │                                      │     │   UserAccount → UserProfile (M:1)   │
│                                     │     │                                      │     │   UserAccount ← PIN (1:1)           │
│                                     │     │                                      │     │   PIN → Request (1:M)               │
└─────────────────────────────────────┘     └──────────────────────────────────────┘     └─────────────────────────────────────┘
         ↑                                              ↑                                             ↑
         │                                              │                                             │
   User Interface                             Business Logic Layer                        Data Persistence Layer
   (Presentation)                             (Application Layer)                          (Domain Models)
```

---

## 2. User Login

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│        LoginPage.tsx                │     │       AuthController                 │     │      UserAccountEntity              │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
│      Frontend - React               │     │       Backend - Node.js              │     │      Database - Prisma              │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ UI Component:                       │     │ API Endpoint:                        │     │ model UserAccount {                 │
│   +email input field                │     │   POST /api/auth/login               │     │   id: string                        │
│   +password input field             │     │                                      │     │   email: string @unique             │
│   +login button                     │     │ +async login(                        │     │   password: string (hashed)         │
│   +error message display            │     │    email: string,                    │     │   name: string                      │
│                                     │     │    password: string                  │     │   status: UserStatus                │
│ API Call:                           │     │  ): Promise<Response>                │     │   userProfileId: string             │
│   +authService.login(email, pwd)    │     │                                      │     │   userProfile: UserProfile          │
│                                     │     │ // Business Logic:                   │     │   pin: PIN                          │
│ User Actions:                       │     │ +find_account_by_email()             │     │   csrRep: CSRRep                    │
│   +enter_credentials()              │     │ +check_account_status_active()       │     │ }                                   │
│   +click_login_button()             │     │ +verify_password_hash()              │     │                                     │
│   +store_token_on_success()         │     │ +check_profile_role()                │     │ Relationships:                      │
│   +navigate_to_dashboard()          │     │ +generate_jwt_token()                │     │   UserAccount → UserProfile (M:1)   │
│                                     │     │ +format_response_with_profile()      │     │   UserAccount ← PIN (1:1)           │
│ HTTP Request:                       │     │                                      │     │   UserAccount ← CSRRep (1:1)        │
│   POST with JSON body               │     │ // Error Handling:                   │     │                                     │
│   { email, password }               │     │ +throw AppError (401)                │     │ Query:                              │
│                                     │     │   if credentials invalid             │     │   prisma.userAccount.findUnique({   │
│ Response Handling:                  │     │ +throw AppError (403)                │     │     where: { email },               │
│   - 200: Save token, redirect       │     │   if account not active              │     │     include: {                      │
│   - 401: Show "Invalid credentials" │     │ +throw AppError (403)                │     │       userProfile: true,            │
│   - 403: Show "Account inactive"    │     │   if pending approval                │     │       pin: true,                    │
│   - 403: Show "Pending approval"    │     │                                      │     │       csrRep: true                  │
│                                     │     │ HTTP Response:                       │     │     }                               │
│                                     │     │   JSON with user + token + profile   │     │   })                                │
│                                     │     │                                      │     │                                     │
│                                     │     │                                      │     │ Password verification:              │
│                                     │     │                                      │     │   Compare hashed password           │
│                                     │     │                                      │     │   using bcrypt                      │
└─────────────────────────────────────┘     └──────────────────────────────────────┘     └─────────────────────────────────────┘
         ↑                                              ↑                                             ↑
         │                                              │                                             │
   User Interface                             Business Logic Layer                        Data Persistence Layer
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
│    csr_registrationPage             │     │       AuthController                 │     │  UserAccount + CSRRepEntity         │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ Route: POST                         │     │ +async registerCSRRep(               │     │ model UserAccount {                 │
│   /api/auth/register/csr-rep        │     │    email: string,                    │     │   // Same as above                  │
│                                     │     │    password: string,                 │     │ }                                   │
│ +validate(registerCSRRepValidation) │     │    companyName: string,              │     │                                     │
│                                     │     │    companyRegistrationNumber: string,│     │ model CSRRep {                      │
│ +send_to_controller()               │     │    industry: string,                 │     │   id: string                        │
│                                     │     │    contactPerson: string,            │     │   userAccountId: string @unique     │
│ +return_JSON_response()             │     │    phoneNumber: string,              │     │   companyName: string               │
│   - 201: Success (pending approval) │     │    companyAddress: string            │     │   companyRegistrationNumber: string │
│   - 409: Email exists               │     │  ): Promise<Response>                │     │   industry: string                  │
│   - 409: Company reg exists         │     │                                      │     │   contactPerson: string             │
│                                     │     │ // Business Logic:                   │     │   phoneNumber: string               │
│                                     │     │ +check_existing_email()              │     │   companyAddress: string            │
│                                     │     │ +check_company_reg_number()          │     │   approvalStatus: UserStatus        │
│                                     │     │ +hash_password()                     │     │   certifications: string            │
│                                     │     │ +get_csrrep_profile_id()             │     │                                     │
│                                     │     │ +create_account_and_profile()        │     │   userAccount: UserAccount          │
│                                     │     │ +set_approval_PENDING()              │     │   volunteerOffers: VolunteerOffer[] │
│                                     │     │ +generate_jwt_token()                │     │   matches: Match[]                  │
│                                     │     │ +format_response()                   │     │   shortlists: Shortlist[]           │
│                                     │     │                                      │     │ }                                   │
│                                     │     │ // Error Handling:                   │     │                                     │
│                                     │     │ +throw AppError (409)                │     │                                     │
│                                     │     │   if email or reg number exists      │     │                                     │
└─────────────────────────────────────┘     └──────────────────────────────────────┘     └─────────────────────────────────────┘
```

---

## 6. Get User Profile

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│       profile_viewPage              │     │       AuthController                 │     │      UserAccountEntity              │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ Route: GET /api/auth/profile        │     │ +async getProfile(                   │     │ model UserAccount {                 │
│                                     │     │    // userId from JWT token          │     │   id: string                        │
│ +authenticate()                     │     │  ): Promise<Response>                │     │   email: string                     │
│   ↓ extracts JWT                    │     │                                      │     │   name: string                      │
│   ↓ verifies token                  │     │ // Business Logic:                   │     │   status: UserStatus                │
│   ↓ attaches user to request        │     │ +get_user_id_from_jwt()              │     │   userProfileId: string             │
│                                     │     │ +find_account_by_id()                │     │   userProfile: UserProfile          │
│ +send_to_controller()               │     │ +include_profile_based_on_role()     │     │   pin: PIN                          │
│                                     │     │ +remove_password_from_response()     │     │   csrRep: CSRRep                    │
│ +return_JSON_response()             │     │ +format_response()                   │     │ }                                   │
│   - 200: User with profile          │     │                                      │     │                                     │
│   - 404: User not found             │     │ // Error Handling:                   │     │ Query:                              │
│   - 401: Invalid/expired token      │     │ +throw AppError (404)                │     │   findUnique({                      │
│                                     │     │   if user not found                  │     │     where: { id: userId },          │
│                                     │     │                                      │     │     include: {                      │
│                                     │     │                                      │     │       userProfile: true,            │
│                                     │     │                                      │     │       pin: true,                    │
│                                     │     │                                      │     │       csrRep: true                  │
│                                     │     │                                      │     │     }                               │
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
│    profile_changePasswordPage       │     │       AuthController                 │     │      UserAccountEntity              │
│         (BOUNDARY)                  │────▶│         (CONTROL)                    │────▶│          (ENTITY)                   │
├─────────────────────────────────────┤     ├──────────────────────────────────────┤     ├─────────────────────────────────────┤
│                                     │     │                                      │     │                                     │
│ Route: PUT /api/auth/password       │     │ +async updatePassword(               │     │ model UserAccount {                 │
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

> **📝 Note**: All diagrams in this document use the **Classical BCE** pattern (Jacobson's OOSE),  
> where Boundary = Frontend, Control = Backend, Entity = Database.  
> This is the appropriate interpretation for academic reports and presentations.

### Common Flow Across All Features:

```
1. BOUNDARY (client/src/)
   ├─ Display UI to user (React components)
   ├─ Capture user input (forms, clicks)
   ├─ Validate input on client side
   ├─ Send HTTP requests to backend (services/)
   └─ Display results and handle errors

2. CONTROL (server/src/)
   ├─ Receive HTTP requests (routes/)
   ├─ Apply middleware (authenticate, authorize, validate)
   ├─ Execute business logic (controllers/)
   ├─ Coordinate with Entity layer (database queries)
   ├─ Handle errors
   └─ Format and send HTTP response

3. ENTITY (server/prisma/schema.prisma)
   ├─ Define data structure (models)
   ├─ Define relationships (one-to-many, many-to-many)
   ├─ Handle database queries (via Prisma ORM)
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

