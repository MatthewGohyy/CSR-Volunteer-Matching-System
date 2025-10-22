# Class Diagrams - Mermaid Format

This document contains class diagrams and ERD in Mermaid format that render automatically on GitHub.

## Table of Contents
1. [Entity Relationship Diagram (ERD)](#1-entity-relationship-diagram-erd)
2. [Entity Class Diagram (Repository Pattern)](#2-entity-class-diagram-repository-pattern)
3. [Controller Class Diagram](#3-controller-class-diagram)
4. [BCE Architecture Diagram](#4-bce-architecture-diagram)

---

## 1. Entity Relationship Diagram (ERD)

**Database Schema:** Shows the relationships between all database tables in the PostgreSQL database.

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
        enum status "ACTIVE, SUSPENDED, DEACTIVATED"
        datetime createdAt
        datetime updatedAt
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
        enum status
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
        enum status
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
        enum urgency "LOW, MEDIUM, HIGH"
        datetime dateNeeded
        string location
        enum status "ACTIVE, MATCHED, COMPLETED, CANCELLED"
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
        enum status "PENDING, ACCEPTED, DECLINED"
        datetime createdAt
        datetime updatedAt
    }
    
    Match {
        uuid id PK
        uuid requestId FK,UK
        uuid csrRepId FK
        uuid pinId FK
        enum status "ACTIVE, COMPLETED, CANCELLED"
        datetime matchedAt
        datetime completedAt
        string cancellationReason
        datetime updatedAt
    }
    
    Notification {
        uuid id PK
        uuid userId FK
        enum type "OFFER_RECEIVED, MATCH_CREATED, MATCH_COMPLETED, etc"
        string message
        boolean isRead
        datetime createdAt
    }
```

---

## 2. Entity Class Diagram (Repository Pattern)

**Entity Classes:** Located in `server/src/entities/`. These classes combine domain business logic (instance methods) with data access operations (static methods) following the Repository Pattern.

```mermaid
classDiagram
    class UserEntity {
        +String id
        +String email
        +String password
        +UserType userType
        +UserStatus status
        +DateTime createdAt
        +DateTime updatedAt
        +PIN pin
        +CSRRep csrRep
        +PlatformManager platformManager
        
        +isActive() boolean
        +isSuspended() boolean
        +isAdmin() boolean
        +isPIN() boolean
        +isCSRRep() boolean
        +isPlatformManager() boolean
        +getProfile() PIN or CSRRep or PlatformManager
        +toJSON() Object
        
        +findAll(page, limit)$ Promise~UserEntity[]~
        +findById(id)$ Promise~UserEntity~
        +findByEmail(email)$ Promise~UserEntity~
        +findByType(type, page, limit)$ Promise~UserEntity[]~
        +findByStatus(status, page, limit)$ Promise~UserEntity[]~
        +create(data)$ Promise~UserEntity~
        +update(id, data)$ Promise~UserEntity~
        +delete(id)$ Promise~boolean~
        +suspend(id)$ Promise~UserEntity~
        +activate(id)$ Promise~UserEntity~
    }

    class RequestEntity {
        +String id
        +String pinId
        +String categoryId
        +String title
        +String description
        +UrgencyLevel urgency
        +DateTime dateNeeded
        +String location
        +RequestStatus status
        +Int viewCount
        +Int shortlistCount
        +DateTime createdAt
        +DateTime updatedAt
        
        +isActive() boolean
        +isMatched() boolean
        +isCompleted() boolean
        +isUrgent() boolean
        +isOverdue() boolean
        +incrementViewCount() number
        +incrementShortlistCount() number
        
        +findAll(page, limit)$ Promise~RequestEntity[]~
        +findById(id)$ Promise~RequestEntity~
        +findByPIN(pinId, page, limit)$ Promise~RequestEntity[]~
        +findByCategory(categoryId, page, limit)$ Promise~RequestEntity[]~
        +findByStatus(status, page, limit)$ Promise~RequestEntity[]~
        +findByUrgency(urgency, page, limit)$ Promise~RequestEntity[]~
        +create(data)$ Promise~RequestEntity~
        +update(id, data)$ Promise~RequestEntity~
        +delete(id)$ Promise~boolean~
        +incrementViewCountDB(id)$ Promise~RequestEntity~
        +incrementShortlistCountDB(id)$ Promise~RequestEntity~
    }

    class PINEntity {
        +String id
        +String userId
        +String name
        +Int age
        +String location
        +String phoneNumber
        +String accessibilityNeeds
        +ProfileStatus status
        
        +isActive() boolean
        +isPending() boolean
        +toJSON() Object
        
        +findAll(page, limit)$ Promise~PINEntity[]~
        +findById(id)$ Promise~PINEntity~
        +findByUserId(userId)$ Promise~PINEntity~
        +create(data)$ Promise~PINEntity~
        +update(id, data)$ Promise~PINEntity~
        +delete(id)$ Promise~boolean~
    }

    class CSRRepEntity {
        +String id
        +String userId
        +String companyName
        +String companyRegistrationNumber
        +String industry
        +String contactPerson
        +String phoneNumber
        +ProfileStatus status
        
        +isActive() boolean
        +isPending() boolean
        +toJSON() Object
        
        +findAll(page, limit)$ Promise~CSRRepEntity[]~
        +findById(id)$ Promise~CSRRepEntity~
        +findByUserId(userId)$ Promise~CSRRepEntity~
        +create(data)$ Promise~CSRRepEntity~
        +update(id, data)$ Promise~CSRRepEntity~
        +delete(id)$ Promise~boolean~
    }

    class PlatformManagerEntity {
        +String id
        +String userId
        +String fullName
        +String department
        +String phone
        
        +toJSON() Object
        
        +findAll(page, limit)$ Promise~PlatformManagerEntity[]~
        +findById(id)$ Promise~PlatformManagerEntity~
        +findByUserId(userId)$ Promise~PlatformManagerEntity~
        +create(data)$ Promise~PlatformManagerEntity~
        +update(id, data)$ Promise~PlatformManagerEntity~
    }

    class MatchEntity {
        +String id
        +String requestId
        +String csrRepId
        +String pinId
        +MatchStatus status
        +DateTime matchedAt
        +DateTime completedAt
        +String cancellationReason
        
        +isActive() boolean
        +isCompleted() boolean
        +isCancelled() boolean
        +toJSON() Object
        
        +findAll(page, limit)$ Promise~MatchEntity[]~
        +findById(id)$ Promise~MatchEntity~
        +findByPIN(pinId)$ Promise~MatchEntity[]~
        +findByCSRRep(csrRepId)$ Promise~MatchEntity[]~
        +findByRequest(requestId)$ Promise~MatchEntity~
        +create(data)$ Promise~MatchEntity~
        +complete(id)$ Promise~MatchEntity~
        +cancel(id, reason)$ Promise~MatchEntity~
    }

    class ServiceCategoryEntity {
        +String id
        +String name
        +String description
        +String iconUrl
        +Boolean isActive
        +DateTime createdAt
        
        +toJSON() Object
        
        +findAll()$ Promise~ServiceCategoryEntity[]~
        +findActive()$ Promise~ServiceCategoryEntity[]~
        +findById(id)$ Promise~ServiceCategoryEntity~
        +create(data)$ Promise~ServiceCategoryEntity~
        +update(id, data)$ Promise~ServiceCategoryEntity~
        +delete(id)$ Promise~boolean~
    }

    class ShortlistEntity {
        +String id
        +String csrRepId
        +String requestId
        +DateTime createdAt
        
        +findAll()$ Promise~ShortlistEntity[]~
        +findByCSRRep(csrRepId)$ Promise~ShortlistEntity[]~
        +findByRequest(requestId)$ Promise~ShortlistEntity[]~
        +exists(csrRepId, requestId)$ Promise~boolean~
        +create(data)$ Promise~ShortlistEntity~
        +deleteByCSRRepAndRequest(csrRepId, requestId)$ Promise~boolean~
    }

    class VolunteerOfferEntity {
        +String id
        +String csrRepId
        +String requestId
        +String message
        +OfferStatus status
        +DateTime createdAt
        
        +isPending() boolean
        +isAccepted() boolean
        +isDeclined() boolean
        
        +findAll()$ Promise~VolunteerOfferEntity[]~
        +findByCSRRep(csrRepId)$ Promise~VolunteerOfferEntity[]~
        +findByRequest(requestId)$ Promise~VolunteerOfferEntity[]~
        +create(data)$ Promise~VolunteerOfferEntity~
        +accept(id)$ Promise~VolunteerOfferEntity~
        +decline(id)$ Promise~VolunteerOfferEntity~
    }

    class NotificationEntity {
        +String id
        +String userId
        +NotificationType type
        +String message
        +Boolean isRead
        +DateTime createdAt
        
        +markAsRead()$ Promise~NotificationEntity~
        
        +findByUser(userId)$ Promise~NotificationEntity[]~
        +findUnreadByUser(userId)$ Promise~NotificationEntity[]~
        +create(data)$ Promise~NotificationEntity~
        +markAsRead(id)$ Promise~NotificationEntity~
        +deleteByUser(userId)$ Promise~boolean~
    }

    UserEntity "1" -- "0..1" PINEntity : has
    UserEntity "1" -- "0..1" CSRRepEntity : has
    UserEntity "1" -- "0..1" PlatformManagerEntity : has
    UserEntity "1" -- "*" NotificationEntity : receives
    
    PINEntity "1" -- "*" RequestEntity : creates
    PINEntity "1" -- "*" MatchEntity : participates
    
    CSRRepEntity "1" -- "*" ShortlistEntity : creates
    CSRRepEntity "1" -- "*" VolunteerOfferEntity : submits
    CSRRepEntity "1" -- "*" MatchEntity : participates
    
    ServiceCategoryEntity "1" -- "*" RequestEntity : categorizes
    
    RequestEntity "1" -- "*" ShortlistEntity : has
    RequestEntity "1" -- "*" VolunteerOfferEntity : receives
    RequestEntity "1" -- "0..1" MatchEntity : becomes

    note for UserEntity "Instance methods: Business logic\nStatic methods: CRUD operations\nUses Prisma ORM internally"
    note for RequestEntity "Implements Repository Pattern\nEncapsulates all data access"
```

---

## 3. Controller Class Diagram

**Controllers:** Located in `server/src/controllers/`. Organized by feature/user type. Controllers orchestrate business logic by calling Entity classes.

```mermaid
classDiagram
    class LoginController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class RegisterPINController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class RegisterCSRRepController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class GetProfileController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class UpdatePasswordController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class CreateUserController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class GetUsersController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class UpdateUserStatusController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class DeleteUserController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class CreateRequestController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class ViewRequestsController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class UpdateRequestController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class DeleteRequestController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class SearchRequestsController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class ShortlistRequestController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class RemoveShortlistController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class SubmitOfferController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class ViewOffersController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class AcceptOfferController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class DeclineOfferController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class MatchController {
        <<static>>
        +createMatch(req, res, next) Promise~void~
        +getMatches(req, res, next) Promise~void~
        +completeMatch(req, res, next) Promise~void~
        +cancelMatch(req, res, next) Promise~void~
    }

    class CreateCategoryController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class GetCategoriesController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    class GetPlatformStatsController {
        <<static>>
        +handle(req, res, next) Promise~void~
    }

    LoginController ..> UserEntity : uses
    RegisterPINController ..> UserEntity : uses
    RegisterPINController ..> PINEntity : uses
    RegisterCSRRepController ..> UserEntity : uses
    RegisterCSRRepController ..> CSRRepEntity : uses
    GetProfileController ..> UserEntity : uses
    
    CreateUserController ..> UserEntity : uses
    GetUsersController ..> UserEntity : uses
    UpdateUserStatusController ..> UserEntity : uses
    DeleteUserController ..> UserEntity : uses
    
    CreateRequestController ..> PINEntity : uses
    CreateRequestController ..> RequestEntity : uses
    ViewRequestsController ..> RequestEntity : uses
    UpdateRequestController ..> RequestEntity : uses
    DeleteRequestController ..> RequestEntity : uses
    SearchRequestsController ..> RequestEntity : uses
    
    ShortlistRequestController ..> CSRRepEntity : uses
    ShortlistRequestController ..> RequestEntity : uses
    ShortlistRequestController ..> ShortlistEntity : uses
    RemoveShortlistController ..> ShortlistEntity : uses
    
    SubmitOfferController ..> CSRRepEntity : uses
    SubmitOfferController ..> RequestEntity : uses
    SubmitOfferController ..> VolunteerOfferEntity : uses
    ViewOffersController ..> VolunteerOfferEntity : uses
    AcceptOfferController ..> VolunteerOfferEntity : uses
    DeclineOfferController ..> VolunteerOfferEntity : uses
    
    MatchController ..> MatchEntity : uses
    MatchController ..> RequestEntity : uses
    MatchController ..> NotificationEntity : uses
    
    CreateCategoryController ..> ServiceCategoryEntity : uses
    GetCategoriesController ..> ServiceCategoryEntity : uses
    GetPlatformStatsController ..> ServiceCategoryEntity : uses
    GetPlatformStatsController ..> RequestEntity : uses
    GetPlatformStatsController ..> MatchEntity : uses

    note for LoginController "Controllers use Entity classes\nfor all data operations"
    note for CreateRequestController "Entity classes implement\nRepository Pattern"
```

---

## 4. BCE Architecture Diagram

**BCE Pattern:** Shows how Boundary, Control, and Entity layers interact.

```mermaid
classDiagram
    class Route_Boundary {
        <<routes>>
        +POST /api/auth/login
        +POST /api/opportunities
        +GET /api/opportunities
        +POST /api/shortlist
        +POST /api/offers
    }

    class Middleware_Boundary {
        <<middleware>>
        +authenticate(req, res, next)
        +authorize(roles)
        +validateRequest(schema)
        +errorHandler(err, req, res, next)
    }

    class Validator_Boundary {
        <<validators>>
        +loginValidation
        +registerPINValidation
        +registerCSRRepValidation
        +createRequestValidation
    }

    class Controller_Control {
        <<controllers>>
        +LoginController
        +CreateRequestController
        +ShortlistRequestController
        +SubmitOfferController
        +AcceptOfferController
        +MatchController
    }

    class Entity_Entity {
        <<entities>>
        +UserEntity
        +RequestEntity
        +PINEntity
        +CSRRepEntity
        +MatchEntity
        +ShortlistEntity
        +VolunteerOfferEntity
        +ServiceCategoryEntity
        +NotificationEntity
    }

    class PrismaSchema_Entity {
        <<prisma>>
        +User model
        +Request model
        +PIN model
        +CSRRep model
        +Match model
        +Shortlist model
        +VolunteerOffer model
        +ServiceCategory model
        +Notification model
    }

    class DTO_Entity {
        <<dto>>
        +LoginDTO
        +CreateUserDTO
        +CreateRequestDTO
        +AuthResponseDTO
        +ApiResponseDTO
    }

    Route_Boundary --> Middleware_Boundary : "uses"
    Route_Boundary --> Validator_Boundary : "uses"
    Middleware_Boundary --> Controller_Control : "forwards to"
    Validator_Boundary --> Controller_Control : "validates for"
    Controller_Control --> Entity_Entity : "calls methods"
    Entity_Entity --> PrismaSchema_Entity : "uses ORM"
    Controller_Control --> DTO_Entity : "uses types"

    note for Route_Boundary "BOUNDARY Layer:\nHTTP endpoints,\nmiddleware,\nvalidators"
    note for Controller_Control "CONTROL Layer:\nBusiness logic\norchestration"
    note for Entity_Entity "ENTITY Layer:\nDomain logic +\nData access\n(Repository Pattern)"
```

---

## How to View These Diagrams

### GitHub
Mermaid diagrams render automatically on GitHub. Just view this file in your repository.

### VS Code
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file and click the preview button (Ctrl+Shift+V or Cmd+Shift+V)

### Online Viewers
- [Mermaid Live Editor](https://mermaid.live/)
- Copy and paste any diagram code to visualize

---

## Legend

### Symbols
- **PK** = Primary Key
- **FK** = Foreign Key  
- **UK** = Unique Key
- **$** = Static method
- **+** = Public method/property
- **-** = Private method/property

### Method Naming Convention
- **Instance methods** (lowercase start): Business logic - `isActive()`, `isPIN()`
- **Static methods** (with $): Data access - `findById()$`, `create()$`

---

## Notes

- All diagrams reflect the **actual implementation** as of October 2025
- Entity classes use **Repository Pattern** (domain logic + data access)
- Controllers call Entity classes (not Prisma directly)
- No service layer exists in this architecture
- For PlantUML diagrams, see [CLASS_DIAGRAMS_PLANTUML.md](./CLASS_DIAGRAMS_PLANTUML.md)

---

**Last Updated:** October 22, 2025
