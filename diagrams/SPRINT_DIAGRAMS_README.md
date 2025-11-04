# Sprint Diagrams Documentation

This folder contains progressive system architecture diagrams organized by sprint. Each sprint builds upon the previous one, showing the incremental development of the CSR Volunteer Matching System.

## 📁 Folder Structure

```
diagrams/
├── sprint1/
│   ├── class-diagram-sprint1.mmd      (Mermaid)
│   ├── class-diagram-sprint1.puml     (PlantUML)
│   ├── erd-diagram-sprint1.mmd        (Mermaid)
│   └── erd-diagram-sprint1.puml       (PlantUML)
├── sprint2/
│   ├── class-diagram-sprint2.mmd      (Mermaid)
│   ├── class-diagram-sprint2.puml     (PlantUML)
│   ├── erd-diagram-sprint2.mmd        (Mermaid)
│   └── erd-diagram-sprint2.puml       (PlantUML)
├── sprint3/
│   ├── class-diagram-sprint3.mmd      (Mermaid)
│   ├── class-diagram-sprint3.puml     (PlantUML)
│   ├── erd-diagram-sprint3.mmd        (Mermaid)
│   └── erd-diagram-sprint3.puml       (PlantUML)
├── sprint4/
│   └── README.md                      (→ Points to final diagrams)
├── class-diagram.mmd                  (Final - Mermaid)
├── class-diagram.puml                 (Final - PlantUML)
├── erd-diagram.mmd                    (Final - Mermaid)
├── erd-diagram.puml                   (Final - PlantUML)
└── *.png                              (Generated images)
```

## 🏃 Sprint Overview

### Sprint 1: Authentication & Basic User/Profile Management
**Duration:** 09 Oct 2025 - 19 Oct 2025  
**User Stories:** 12 stories (#1, #2, #3, #6, #8, #11, #13, #14, #24, #25, #33, #34)

**Entities Introduced:**
- ✅ UserProfile
- ✅ UserAccount

**Enums:**
- UserStatus (ACTIVE, SUSPENDED, DELETED)
- ProfileStatus (ACTIVE, SUSPENDED, DEACTIVATED)

**Focus:**
- Login/Logout for all 4 user roles (User Admin, PIN, CSR Rep, Platform Manager)
- Create and suspend user accounts
- Create and suspend user profiles
- Single Table Inheritance pattern implementation

**Architecture Decision:** Implemented Single Table Inheritance with UserProfile (4 static records) and UserAccount (all role-specific fields nullable).

---

### Sprint 2: Advanced User/Profile Management & Category Management
**Duration:** 19 Oct 2025 - 26 Oct 2025  
**User Stories:** 11 stories (#4, #5, #7, #9, #10, #12, #35, #36, #37, #38, #39)

**New Entities:**
- ✅ RequestCategory

**No new enums**

**Focus:**
- View, update, search operations for user accounts
- View, update, search operations for user profiles
- Complete CRUD operations for request categories (Platform Manager)

**Why RequestCategory in Sprint 2?**
While not strictly required by the user stories until Sprint 3, RequestCategory is introduced here because:
1. Platform Manager stories (#35-#39) specifically manage categories
2. Categories must exist before requests can reference them in Sprint 3
3. This follows proper database design - setup foundational data structures first

---

### Sprint 3: Request Management & Shortlisting
**Duration:** 26 Oct 2025 - 02 Nov 2025  
**User Stories:** 10 stories (#15, #16, #17, #18, #19, #20, #21, #26, #27, #28)

**New Entities:**
- ✅ Request
- ✅ Shortlist

**New Enums:**
- RequestStatus (ACTIVE, MATCHED, COMPLETED, CANCELLED)
- UrgencyLevel (LOW, MEDIUM, HIGH)

**Focus:**
- PIN: Create, view, update, delete, search requests
- PIN: Track view counts and shortlist counts
- CSR Rep: Search and view requests
- CSR Rep: Save requests to shortlist

**Key Relationships:**
- Request → UserAccount (PIN creates)
- Request → RequestCategory (categorization)
- Shortlist → UserAccount (CSR Rep saves)
- Shortlist → Request (which request is shortlisted)

**Why These Entities?**
- Request is core to PIN user stories (#15-#21)
- Shortlist is needed for CSR Rep to save requests (#28)
- View/shortlist counters are maintained on Request entity

---

### Sprint 4: Complete System (Final Diagrams)
**Duration:** TBD  
**User Stories:** 6 stories (#22, #23, #29, #30, #31, #32)

**📌 Sprint 4 = Final System Architecture**

Sprint 4 represents the **complete, fully-built system**. Instead of separate Sprint 4 diagrams, refer to the **final diagrams in the root diagrams folder**:
- `class-diagram.mmd` / `class-diagram.puml`
- `erd-diagram.mmd` / `erd-diagram.puml`

**New Entities in Sprint 4:**
- ✅ VolunteerOffer
- ✅ Match
- ✅ Notification

**New Enums:**
- OfferStatus (PENDING, ACCEPTED, DECLINED)
- MatchStatus (ACTIVE, COMPLETED, CANCELLED)
- NotificationType (VOLUNTEER_OFFER, OFFER_ACCEPTED, OFFER_DECLINED, MATCH_CONFIRMED, MATCH_CANCELLED, REQUEST_UPDATED)

**Focus:**
- View and search historical completed requests (PIN & CSR Rep)
- Advanced shortlist management (search, view)
- Complete matching system implementation
- Notification system

**Complete System - All 8 Entities:**
1. UserProfile (4 static records)
2. UserAccount (Single Table Inheritance)
3. RequestCategory
4. Request
5. Shortlist
6. VolunteerOffer
7. Match
8. Notification

**Why These Entities?**
- History features (#22, #23, #31, #32) require completed matches
- Match entity represents PIN-CSR Rep pairing
- VolunteerOffer tracks CSR Rep offers to help
- Notification keeps users informed of system events

**Why Sprint 4 = Final Diagrams?**
By Sprint 4, you've incrementally built up to the complete architecture. The final diagrams represent this complete state, eliminating duplication.

---

## 🎯 Design Principles Applied

### 1. Progressive Complexity
Each sprint introduces only the entities needed for its user stories, avoiding overwhelming early diagrams with unnecessary complexity.

### 2. Architectural Integrity
Even though entities are introduced progressively, each sprint's diagram maintains complete architectural integrity:
- All necessary relationships are shown
- Foreign keys are properly defined
- Enums are included when their related entities appear

### 3. Single Table Inheritance Pattern
Consistently maintained across all sprints:
- UserProfile: 4 static records (PIN, CSR_REP, USER_ADMIN, PLATFORM_MANAGER)
- UserAccount: Single table with role-specific nullable fields
- No separate entity classes for different user types

### 4. Database Design Best Practices
- All tables have UUID primary keys
- Unique constraints where needed (email, companyRegistrationNumber, etc.)
- Proper foreign key relationships
- Timestamps for audit trails
- Nullable fields marked appropriately

---

## 📊 Entity Evolution Table

| Entity | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 |
|--------|----------|----------|----------|----------|
| UserProfile | ✅ | ✅ | ✅ | ✅ |
| UserAccount | ✅ | ✅ | ✅ | ✅ |
| RequestCategory | ❌ | ✅ | ✅ | ✅ |
| Request | ❌ | ❌ | ✅ | ✅ |
| Shortlist | ❌ | ❌ | ✅ | ✅ |
| VolunteerOffer | ❌ | ❌ | ❌ | ✅ |
| Match | ❌ | ❌ | ❌ | ✅ |
| Notification | ❌ | ❌ | ❌ | ✅ |

---

## 🔍 How to Use These Diagrams

### For Development Teams:
1. **Sprint 1:** Implement authentication and basic user management
2. **Sprint 2:** Add category management and advanced user operations
3. **Sprint 3:** Build request and shortlisting features
4. **Sprint 4:** Complete with matching and notification systems

### For Documentation:
- Use sprint-specific diagrams to show system evolution in presentations
- Reference the appropriate sprint diagram when discussing specific features
- Show stakeholders the incremental progress

### For Database Migration:
Each sprint's ERD can guide database migration scripts:
- Sprint 1: Create user_profiles and user_accounts tables
- Sprint 2: Add request_categories table
- Sprint 3: Add requests and shortlists tables
- Sprint 4: Add volunteer_offers, matches, and notifications tables

---

## 📝 Notes

### Why Some Entities Appear Earlier Than Their User Stories?
- **RequestCategory in Sprint 2:** Must exist before requests can reference them
- **Foreign Key Dependencies:** Some entities need others to exist first for referential integrity

### Architectural Consistency:
All diagrams follow the same naming conventions, field types, and relationship patterns established in the final system design.

### Diagram Formats:
All diagrams are available in **two formats**:

**Mermaid (.mmd files):**
- Easy rendering in GitHub/GitLab markdown
- VS Code with Mermaid extension
- Documentation tools
- Lightweight and text-based

**PlantUML (.puml files):**
- Industry-standard UML notation
- Rich diagram generation with `plantuml` command
- Better for formal documentation
- More detailed styling options

---

## 🚀 Quick Start

### Viewing Mermaid Diagrams (.mmd)

1. **VS Code:** Install "Mermaid Preview" extension
2. **Online:** Use [Mermaid Live Editor](https://mermaid.live)
3. **Command Line:** Use `mmdc` (mermaid-cli)

```bash
# Generate PNG from Mermaid diagram
mmdc -i sprint1/class-diagram-sprint1.mmd -o sprint1/class-diagram-sprint1.png
```

### Viewing PlantUML Diagrams (.puml)

1. **VS Code:** Install "PlantUML" extension
2. **Online:** Use [PlantUML Web Server](https://www.plantuml.com/plantuml/uml)
3. **Command Line:** Use `plantuml` command

```bash
# Generate PNG from PlantUML diagram
plantuml sprint1/class-diagram-sprint1.puml

# Generate PNG for all sprint diagrams
plantuml sprint1/*.puml sprint2/*.puml sprint3/*.puml
```

---

**Last Updated:** 02 Nov 2025  
**Total User Stories:** 39 across 4 sprints  
**Architecture Pattern:** Single Table Inheritance with Progressive Feature Addition
