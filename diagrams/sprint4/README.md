# Sprint 4: Complete System

**Duration:** TBD  
**User Stories:** #22, #23, #29, #30, #31, #32  
**Focus:** History & Advanced Features

## 🎯 Sprint 4 = Final System

Sprint 4 represents the **complete, fully-built system** with all entities and features implemented.

Instead of separate Sprint 4 diagrams, **refer to the final diagrams in the root diagrams folder:**

### Final Diagrams (Complete System)

📁 **Class Diagrams:**
- [`diagrams/class-diagram.mmd`](../class-diagram.mmd) - Mermaid version
- [`diagrams/class-diagram.puml`](../class-diagram.puml) - PlantUML version
- [`diagrams/CSR_Volunteer_Matching_System_Class_Diagram.png`](../CSR_Volunteer_Matching_System_Class_Diagram.png) - Generated PNG

📁 **ERD Diagrams:**
- [`diagrams/erd-diagram.mmd`](../erd-diagram.mmd) - Mermaid version
- [`diagrams/erd-diagram.puml`](../erd-diagram.puml) - PlantUML version
- [`diagrams/CSR_Volunteer_Matching_System_ERD.png`](../CSR_Volunteer_Matching_System_ERD.png) - Generated PNG

---

## 📊 Complete System Overview

### All 8 Entities

Sprint 4 includes **all entities** from previous sprints plus new ones:

**From Sprint 1:**
- ✅ UserProfile
- ✅ UserAccount

**From Sprint 2:**
- ✅ RequestCategory

**From Sprint 3:**
- ✅ Request
- ✅ Shortlist

**New in Sprint 4:**
- ✅ VolunteerOffer
- ✅ Match
- ✅ Notification

### All 7 Enums

- UserStatus (ACTIVE, SUSPENDED, DELETED)
- ProfileStatus (ACTIVE, SUSPENDED, DEACTIVATED)
- RequestStatus (ACTIVE, MATCHED, COMPLETED, CANCELLED)
- UrgencyLevel (LOW, MEDIUM, HIGH)
- **OfferStatus (PENDING, ACCEPTED, DECLINED)** ← New
- **MatchStatus (ACTIVE, COMPLETED, CANCELLED)** ← New
- **NotificationType (VOLUNTEER_OFFER, OFFER_ACCEPTED, OFFER_DECLINED, MATCH_CONFIRMED, MATCH_CANCELLED, REQUEST_UPDATED)** ← New

---

## 🚀 Sprint 4 User Stories

### History Features

| ID | Role | User Story |
|----|------|------------|
| #22 | PIN | As a PIN, I want to search the history of previously completed requests so that I can review past help I've received. |
| #23 | PIN | I want to view the history of previously completed requests so that I can review past help I've received. |
| #31 | CSR Rep | As a CSR Rep, I want to search the history of previously completed requests so that I can review past assistance I have provided. |
| #32 | CSR Rep | As a CSR Rep, I want to view the history of previously completed requests so that I can review past assistance I have provided. |

### Advanced Shortlist Management

| ID | Role | User Story |
|----|------|------------|
| #29 | CSR Rep | As a CSR Rep, I want to search my shortlist so that I can find requests that I am interested in helping with. |
| #30 | CSR Rep | As a CSR Rep, I want to view my shortlist so that I can easily access requests that I am interested in helping with. |

---

## 🔗 Related Documentation

- [`SPRINT_DIAGRAMS_README.md`](../SPRINT_DIAGRAMS_README.md) - Complete sprint progression documentation
- [`DESIGN_PATTERN.md`](../DESIGN_PATTERN.md) - Single Table Inheritance pattern explanation
- [`USER_STORIES.md`](../../USER_STORIES.md) - All user stories organized by sprint

---

## 💡 Why Sprint 4 = Final Diagrams?

The sprint structure follows **incremental development**:

1. **Sprint 1** → Foundation (Auth & Users)
2. **Sprint 2** → Categories
3. **Sprint 3** → Requests & Shortlisting
4. **Sprint 4** → Complete system (all features)

By Sprint 4, you've built up to the final architecture. The final diagrams in the root folder represent this complete state, eliminating the need for duplicate Sprint 4-specific diagrams.

---

## 📖 How to Use

### For Development:
Implement Sprint 4 user stories (#22, #23, #29, #30, #31, #32) using the complete system diagrams as reference.

### For Documentation:
- Show Sprints 1-3 diagrams to illustrate incremental progress
- Show final diagrams (Sprint 4) to illustrate the complete system

### For Presentations:
1. **Sprint 1 diagrams** - "We started with authentication..."
2. **Sprint 2 diagrams** - "Then added category management..."
3. **Sprint 3 diagrams** - "Then built request and shortlist features..."
4. **Final diagrams (Sprint 4)** - "And this is our complete system!"

---

**This approach avoids duplication and clearly shows that Sprint 4 represents the fully-realized system architecture.**
