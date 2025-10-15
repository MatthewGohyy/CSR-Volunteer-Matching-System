# Class Diagrams - Mermaid Format

This document contains class diagrams in Mermaid format that can be rendered directly on GitHub and most markdown viewers.

## Table of Contents
1. [Entity Relationship Diagram](#1-entity-relationship-diagram)
2. [Controller Class Diagram](#2-controller-class-diagram)
3. [Service Layer Diagram](#3-service-layer-diagram)
4. [System Architecture Overview](#4-system-architecture-overview)

---

## 1. Entity Relationship Diagram

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String password
        +UserType userType
        +UserStatus status
        +DateTime createdAt
        +DateTime updatedAt
        +getProfile()
        +updateStatus()
    }

    class PIN {
        +String id
        +String userId
        +String name
        +Int age
        +String location
        +String phoneNumber
        +String accessibilityNeeds
        +createRequest()
        +getRequests()
    }

    class CSRRep {
        +String id
        +String userId
        +String companyName
        +String companyRegistrationNumber
        +String industry
        +String contactPerson
        +String phoneNumber
        +shortlistRequest()
        +submitOffer()
    }

    class PlatformManager {
        +String id
        +String userId
        +String fullName
        +String department
        +String phone
        +createCategory()
        +manageReports()
    }

    class Request {
        +String id
        +String pinId
        +String categoryId
        +String title
        +String description
        +UrgencyLevel urgency
        +RequestStatus status
        +Int viewCount
        +Int shortlistCount
        +incrementViewCount()
        +updateStatus()
    }

    class ServiceCategory {
        +String id
        +String name
        +String description
        +Boolean isActive
        +DateTime createdAt
    }

    class Shortlist {
        +String id
        +String csrRepId
        +String requestId
        +DateTime createdAt
    }

    class VolunteerOffer {
        +String id
        +String csrRepId
        +String requestId
        +String message
        +OfferStatus status
        +accept()
        +decline()
    }

    class Match {
        +String id
        +String requestId
        +String csrRepId
        +String pinId
        +MatchStatus status
        +DateTime matchedAt
        +complete()
        +cancel()
    }

    class Notification {
        +String id
        +String userId
        +NotificationType type
        +String message
        +Boolean isRead
        +markAsRead()
    }

    User "1" -- "0..1" PIN
    User "1" -- "0..1" CSRRep
    User "1" -- "0..1" PlatformManager
    User "1" -- "*" Notification
    
    PIN "1" -- "*" Request
    PIN "1" -- "*" Match
    
    CSRRep "1" -- "*" Shortlist
    CSRRep "1" -- "*" VolunteerOffer
    CSRRep "1" -- "*" Match
    
    ServiceCategory "1" -- "*" Request
    
    Request "1" -- "*" Shortlist
    Request "1" -- "*" VolunteerOffer
    Request "1" -- "0..1" Match
```

---

## 2. Controller Class Diagram

```mermaid
classDiagram
    class AuthController {
        <<static>>
        +registerPIN(req, res, next)
        +registerCSRRep(req, res, next)
        +login(req, res, next)
        +getProfile(req, res, next)
        +updatePassword(req, res, next)
        -generateToken(payload)
        -validateCredentials(email, password)
    }

    class AdminController {
        <<static>>
        +getUsers(req, res, next)
        +getUserById(req, res, next)
        +createUser(req, res, next)
        +updateUserStatus(req, res, next)
        +deleteUser(req, res, next)
        +getSystemStats(req, res, next)
        -validateUserType(userType)
    }

    class PINController {
        <<static>>
        +getProfile(req, res, next)
        +updateProfile(req, res, next)
        +getMyMatches(req, res, next)
        +getNotifications(req, res, next)
        +markNotificationRead(req, res, next)
    }

    class CSRRepController {
        <<static>>
        +shortlistRequest(req, res, next)
        +removeShortlist(req, res, next)
        +getShortlists(req, res, next)
        +submitOffer(req, res, next)
        +getMyOffers(req, res, next)
        +getMyMatches(req, res, next)
        +updateProfile(req, res, next)
    }

    class RequestController {
        <<static>>
        +createRequest(req, res, next)
        +getRequests(req, res, next)
        +getRequest(req, res, next)
        +getMyRequests(req, res, next)
        +updateRequest(req, res, next)
        +deleteRequest(req, res, next)
        +getCategories(req, res, next)
    }

    class MatchController {
        <<static>>
        +createMatch(req, res, next)
        +getMatches(req, res, next)
        +completeMatch(req, res, next)
        +cancelMatch(req, res, next)
        -notifyParticipants(matchId, type)
    }

    AuthController --> PrismaClient : uses
    AdminController --> PrismaClient : uses
    PINController --> PrismaClient : uses
    CSRRepController --> PrismaClient : uses
    RequestController --> PrismaClient : uses
    MatchController --> PrismaClient : uses
```

---

## 3. Service Layer Diagram

```mermaid
classDiagram
    class UserService {
        -UserRepository userRepository
        +createUser(userData) ApiResponse~User~
        +getUserById(id) ApiResponse~User~
        +updateUser(id, updates) ApiResponse~User~
        +deleteUser(id) ApiResponse~boolean~
        +getAllUsers(limit, offset) ApiResponse~User[]~
    }

    class VolunteerService {
        -VolunteerRepository volunteerRepository
        +createVolunteer(data) ApiResponse~Volunteer~
        +getVolunteerById(id) ApiResponse~Volunteer~
        +updateVolunteer(id, updates) ApiResponse~Volunteer~
        +findVolunteersBySkills(skills) ApiResponse~Volunteer[]~
    }

    class CSROpportunityService {
        -CSROpportunityRepository opportunityRepository
        -OrganizationRepository organizationRepository
        +createOpportunity(data) ApiResponse~CSROpportunity~
        +getOpportunityById(id) ApiResponse~CSROpportunity~
        +updateOpportunity(id, updates) ApiResponse~CSROpportunity~
        +getActiveOpportunities() ApiResponse~CSROpportunity[]~
    }

    class MatchingService {
        -MatchingRepository matchingRepository
        -VolunteerRepository volunteerRepository
        -CSROpportunityRepository opportunityRepository
        +findMatchesForVolunteer(volunteerId) ApiResponse~Matching[]~
        -calculateMatchScore(volunteer, opportunity) number
        -generateMatchReasons(volunteer, opportunity) string[]
    }

    class UserRepository {
        <<interface>>
        +findById(id) Promise~User~
        +findByEmail(email) Promise~User~
        +create(user) Promise~User~
        +update(id, updates) Promise~User~
        +delete(id) Promise~boolean~
    }

    class VolunteerRepository {
        <<interface>>
        +findById(id) Promise~Volunteer~
        +create(volunteer) Promise~Volunteer~
        +update(id, updates) Promise~Volunteer~
        +findBySkills(skills) Promise~Volunteer[]~
    }

    class CSROpportunityRepository {
        <<interface>>
        +findById(id) Promise~CSROpportunity~
        +create(opportunity) Promise~CSROpportunity~
        +update(id, updates) Promise~CSROpportunity~
        +findActive() Promise~CSROpportunity[]~
    }

    class MatchingRepository {
        <<interface>>
        +findById(id) Promise~Matching~
        +create(matching) Promise~Matching~
        +findByVolunteer(volunteerId) Promise~Matching[]~
    }

    UserService --> UserRepository : uses
    VolunteerService --> VolunteerRepository : uses
    CSROpportunityService --> CSROpportunityRepository : uses
    CSROpportunityService --> OrganizationRepository : uses
    MatchingService --> MatchingRepository : uses
    MatchingService --> VolunteerRepository : uses
    MatchingService --> CSROpportunityRepository : uses
```

---

## 4. System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend - Boundary Layer"
        A[LoginPage]
        B[AdminDashboard]
        C[PINDashboard]
        D[CSRRepDashboard]
        E[RequestForm]
        F[RequestList]
    end

    subgraph "API Services"
        G[AuthService]
        H[AdminService]
        I[RequestService]
        J[CSRRepService]
        K[PINService]
    end

    subgraph "Backend Controllers"
        L[AuthController]
        M[AdminController]
        N[RequestController]
        O[CSRRepController]
        P[PINController]
    end

    subgraph "Service Layer"
        Q[UserService]
        R[MatchingService]
        S[CSROpportunityService]
    end

    subgraph "Data Access"
        T[(PostgreSQL Database)]
        U[Prisma ORM]
    end

    subgraph "Entities"
        V[User]
        W[PIN]
        X[CSRRep]
        Y[Request]
        Z[Match]
    end

    A --> G
    B --> H
    C --> K
    D --> J
    E --> I
    F --> I

    G --> L
    H --> M
    I --> N
    J --> O
    K --> P

    L --> Q
    M --> Q
    N --> Q
    O --> R
    P --> R

    Q --> U
    R --> U
    S --> U

    U --> T

    U -.-> V
    U -.-> W
    U -.-> X
    U -.-> Y
    U -.-> Z
```

---

## 5. Frontend Component Architecture

```mermaid
classDiagram
    class LoginPage {
        -String email
        -String password
        -String error
        -AuthService authService
        +handleSubmit(e)
        +validateForm() boolean
        +navigateToDashboard()
    }

    class AdminDashboard {
        -User[] users
        -User selectedUser
        -Boolean showCreateModal
        -AdminService adminService
        +fetchUsers()
        +handleCreateUser(data)
        +handleUpdateUser(id, data)
        +handleSuspendUser(id)
        +handleSearch(term)
    }

    class CreateUserModal {
        -Object formData
        -String[] userTypes
        -Function onClose
        -Function onSubmit
        +handleInputChange(e)
        +handleSubmit(e)
        +resetForm()
    }

    class UserDetailsModal {
        -User user
        -Function onClose
        -Function onUpdate
        +handleUpdate(data)
    }

    class AuthService {
        -String baseURL
        +login(credentials) Promise~AuthResponse~
        +logout()
        +getToken() String
        +setToken(token)
        +isAuthenticated() boolean
    }

    class AdminService {
        -String baseURL
        +getUsers(params) Promise~User[]~
        +createUser(userData) Promise~User~
        +updateUser(id, data) Promise~User~
        +deleteUser(id) Promise~void~
        +suspendUser(id) Promise~void~
    }

    class RequestService {
        -String baseURL
        +getRequests(filters) Promise~Request[]~
        +createRequest(data) Promise~Request~
        +updateRequest(id, data) Promise~Request~
        +deleteRequest(id) Promise~void~
    }

    LoginPage --> AuthService
    AdminDashboard --> AdminService
    AdminDashboard *-- CreateUserModal
    AdminDashboard *-- UserDetailsModal
```

---

## 6. Request Flow Sequence

```mermaid
sequenceDiagram
    participant U as User/Browser
    participant L as LoginPage
    participant AS as AuthService
    participant AC as AuthController
    participant DB as Database

    U->>L: Enter credentials
    L->>L: validateForm()
    L->>AS: login(credentials)
    AS->>AC: POST /api/auth/login
    AC->>DB: findUser(email)
    DB-->>AC: user data
    AC->>AC: validatePassword()
    AC->>AC: generateToken()
    AC-->>AS: {user, token}
    AS-->>L: AuthResponse
    L->>L: navigateToDashboard()
    L-->>U: Redirect to Dashboard
```

---

## 7. User Creation Flow

```mermaid
sequenceDiagram
    participant A as Admin
    participant AD as AdminDashboard
    participant CM as CreateUserModal
    participant AdminS as AdminService
    participant AdminC as AdminController
    participant DB as Database

    A->>AD: Click "Create User"
    AD->>CM: Open modal
    A->>CM: Fill form & submit
    CM->>CM: validateForm()
    CM->>AdminS: createUser(formData)
    AdminS->>AdminC: POST /api/admin/users
    AdminC->>AdminC: validateUserType()
    AdminC->>AdminC: hashPassword()
    AdminC->>DB: createUser + Profile
    DB-->>AdminC: created user
    AdminC-->>AdminS: {user, message}
    AdminS-->>CM: success response
    CM->>AD: Close modal & refresh
    AD->>AdminS: fetchUsers()
    AdminS-->>AD: updated user list
```

---

## 8. Request Matching Flow

```mermaid
sequenceDiagram
    participant CSR as CSR Rep
    participant UI as Dashboard
    participant RS as RequestService
    participant RC as RequestController
    participant MS as MatchingService
    participant DB as Database

    CSR->>UI: Browse requests
    UI->>RS: getRequests(filters)
    RS->>RC: GET /api/requests
    RC->>DB: findMany(filters)
    DB-->>RC: requests[]
    RC-->>RS: requests with details
    RS-->>UI: display requests
    
    CSR->>UI: Click "Shortlist"
    UI->>RS: shortlistRequest(requestId)
    RS->>RC: POST /api/csrrep/shortlist
    RC->>DB: create shortlist
    RC->>DB: increment shortlistCount
    DB-->>RC: shortlist created
    RC-->>RS: success
    RS-->>UI: update UI
    
    CSR->>UI: Click "Submit Offer"
    UI->>RS: submitOffer(requestId, message)
    RS->>RC: POST /api/csrrep/offer
    RC->>DB: create volunteer offer
    RC->>DB: create notification
    DB-->>RC: offer created
    RC-->>RS: success
    RS-->>UI: show confirmation
```

---

## Enums and Types

### UserType Enum
```
PIN | CSR_REP | ADMIN | PLATFORM_MANAGER
```

### UserStatus Enum
```
ACTIVE | SUSPENDED | DEACTIVATED
```

### RequestStatus Enum
```
ACTIVE | MATCHED | COMPLETED | CANCELLED
```

### UrgencyLevel Enum
```
LOW | MEDIUM | HIGH
```

### OfferStatus Enum
```
PENDING | ACCEPTED | DECLINED
```

### MatchStatus Enum
```
ACTIVE | COMPLETED | CANCELLED
```

### NotificationType Enum
```
VOLUNTEER_OFFER | OFFER_ACCEPTED | OFFER_DECLINED | 
MATCH_CONFIRMED | MATCH_CANCELLED | REQUEST_UPDATED
```

---

## How to View These Diagrams

### GitHub
Mermaid diagrams render automatically on GitHub. Just view this file in your repository.

### VS Code
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file and click the preview button

### Online Viewers
- [Mermaid Live Editor](https://mermaid.live/)
- Copy and paste any diagram code to visualize

---

## Key Architecture Patterns

1. **BCE Pattern**: Boundary (UI) → Controller (API) → Entity (Database)
2. **Repository Pattern**: Data access abstraction
3. **Service Layer**: Business logic encapsulation
4. **MVC Pattern**: Model-View-Controller separation
5. **Dependency Injection**: Loose coupling between components

---

## Related Documentation

- [PlantUML Class Diagrams](./CLASS_DIAGRAMS.md) - Detailed UML diagrams
- [BCE Architecture Guide](./BCE_ARCHITECTURE.md) - Architecture explanation
- [API Documentation](./API_DOCUMENTATION.md) - API endpoints reference

