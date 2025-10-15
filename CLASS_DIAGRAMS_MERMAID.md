# Class Diagrams - Mermaid Format

This document contains class diagrams and ERD in Mermaid format that render automatically on GitHub.

## Table of Contents
1. [Entity Relationship Diagram (ERD)](#1-entity-relationship-diagram-erd)
2. [Entity Class Diagram](#2-entity-class-diagram)
3. [Controller Class Diagram](#3-controller-class-diagram)
4. [Service Layer Diagram](#4-service-layer-diagram)

---

## 1. Entity Relationship Diagram (ERD)

**Note:** User table has 4 user types (PIN, CSR_REP, ADMIN, PLATFORM_MANAGER), but ADMIN users have no separate profile table. Only PIN, CSRRep, and PlatformManager have profile tables.

```mermaid
erDiagram
    User ||--o| PIN : "has"
    User ||--o| CSRRep : "has"
    User ||--o| PlatformManager : "has"
    User ||--o{ Notification : "receives"
    
    PIN ||--o{ Request : "creates"
    PIN ||--o{ Match : "participates in"
    
    CSRRep ||--o{ Shortlist : "creates"
    CSRRep ||--o{ VolunteerOffer : "submits"
    CSRRep ||--o{ Match : "participates in"
    
    ServiceCategory ||--o{ Request : "categorizes"
    
    Request ||--o{ Shortlist : "has"
    Request ||--o{ VolunteerOffer : "receives"
    Request ||--o| Match : "becomes"
    
    User {
        uuid id PK
        string email UK
        string password
        enum userType "PIN, CSR_REP, ADMIN, PLATFORM_MANAGER"
        enum status
        datetime createdAt
        datetime updatedAt
        string note "ADMIN users have no profile table"
    }
    
    PIN {
        uuid id PK
        uuid userId FK
        string name
        int age
        string location
        string phoneNumber
        string accessibilityNeeds
        string profilePhoto
    }
    
    CSRRep {
        uuid id PK
        uuid userId FK
        string companyName
        string companyRegistrationNumber UK
        string industry
        string contactPerson
        string phoneNumber
        string companyAddress
        string companyLogo
    }
    
    PlatformManager {
        uuid id PK
        uuid userId FK
        string fullName
        string department
        string phone
    }
    
    ServiceCategory {
        uuid id PK
        string name UK
        string description
        string iconUrl
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    
    Request {
        uuid id PK
        uuid pinId FK
        uuid categoryId FK
        string title
        string description
        enum urgency
        datetime dateNeeded
        string location
        enum status
        int viewCount
        int shortlistCount
        datetime createdAt
        datetime updatedAt
    }
    
    Shortlist {
        uuid id PK
        uuid csrRepId FK
        uuid requestId FK
        datetime createdAt
    }
    
    VolunteerOffer {
        uuid id PK
        uuid csrRepId FK
        uuid requestId FK
        string message
        enum status
        datetime createdAt
        datetime updatedAt
    }
    
    Match {
        uuid id PK
        uuid requestId FK,UK
        uuid csrRepId FK
        uuid pinId FK
        enum status
        datetime matchedAt
        datetime completedAt
        string cancellationReason
        datetime updatedAt
    }
    
    Notification {
        uuid id PK
        uuid userId FK
        enum type
        string message
        boolean isRead
        datetime createdAt
    }
```

---

## 2. Entity Class Diagram

**Note:** UserType includes PIN, CSR_REP, ADMIN, and PLATFORM_MANAGER, but ADMIN users have no profile table.

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
        +getProfile() PINProfile or CSRRepProfile or PlatformManagerProfile or null
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

## 3. Controller Class Diagram

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

## 4. Service Layer Diagram

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

## Notes
- **PK** = Primary Key
- **FK** = Foreign Key
- **UK** = Unique Key
- Diagrams render automatically on GitHub
- For PlantUML diagrams, see [CLASS_DIAGRAMS.md](./CLASS_DIAGRAMS.md)

