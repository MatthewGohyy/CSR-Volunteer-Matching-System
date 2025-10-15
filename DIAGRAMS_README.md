# Class Diagrams Documentation Guide

Welcome to the CSR Volunteer Matching System class diagrams documentation! This guide will help you understand and navigate the various diagrams available.

## 📁 Available Diagram Files

### 1. **CLASS_DIAGRAMS.md** (PlantUML Format)
- **Format**: PlantUML
- **Best For**: Professional documentation, detailed UML diagrams, academic submissions
- **Rendering**: Requires PlantUML tool or online viewer
- **Contents**:
  - Entity Layer Class Diagram (complete database model)
  - Controller Layer Class Diagram (API handlers)
  - Service & Repository Layer Class Diagram (business logic)
  - Complete BCE Architecture Diagram (full system overview)
  - Frontend Component Class Diagram (React components)

### 2. **CLASS_DIAGRAMS_MERMAID.md** (Mermaid Format)
- **Format**: Mermaid
- **Best For**: GitHub viewing, quick reference, online collaboration
- **Rendering**: Automatic on GitHub, VS Code with extension
- **Contents**:
  - Entity Relationship Diagram
  - Controller Class Diagram
  - Service Layer Diagram
  - System Architecture Overview
  - Frontend Component Architecture
  - Sequence Diagrams (Request flows)

---

## 🎯 Quick Start Guide

### For GitHub Viewing
1. Open `CLASS_DIAGRAMS_MERMAID.md` directly on GitHub
2. All diagrams will render automatically
3. Perfect for team reviews and documentation

### For Local Development
1. **VS Code**:
   ```bash
   # Install extensions:
   # - PlantUML
   # - Markdown Preview Mermaid Support
   ```
2. **Online Viewers**:
   - PlantUML: https://www.planttext.com/
   - Mermaid: https://mermaid.live/

### For Academic Submission
1. Generate PNG/SVG images from PlantUML:
   ```bash
   # Install PlantUML
   brew install plantuml  # macOS
   
   # Generate images
   plantuml CLASS_DIAGRAMS.md
   ```
2. Include generated images in your report

---

## 📊 Diagram Types Explained

### 1. Entity/Class Diagrams
**Purpose**: Show the structure of classes and their relationships

**Key Elements**:
- **Classes**: Rectangles with class name, attributes, and methods
- **Relationships**: 
  - `-->` : Association (uses/has)
  - `--|>` : Inheritance (is-a)
  - `--*` : Composition (owns)
  - `--o` : Aggregation (has)
- **Multiplicity**: `1`, `0..1`, `0..*`, `1..*`

**Example**:
```
User "1" -- "0..1" PIN : has
```
(One User has zero or one PIN profile)

### 2. Sequence Diagrams
**Purpose**: Show how objects interact over time

**Key Elements**:
- **Participants**: Actors/Objects in the interaction
- **Messages**: Arrows between participants
- **Activation**: Vertical bars showing active processing
- **Return**: Dashed arrows for responses

**Use Cases**:
- Login flow
- User creation process
- Request matching workflow

### 3. Architecture Diagrams
**Purpose**: Show system components and their relationships

**Key Elements**:
- **Layers**: Frontend, Backend, Database
- **Components**: Services, Controllers, Entities
- **Data Flow**: Direction of information flow

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         BOUNDARY LAYER (Frontend)               │
│  - LoginPage                                    │
│  - AdminDashboard                               │
│  - CreateUserModal                              │
│  - RequestForm, RequestList                     │
└─────────────────────────────────────────────────┘
                      ↓ HTTP/REST
┌─────────────────────────────────────────────────┐
│      CONTROLLER LAYER (Backend API)             │
│  - AuthController                               │
│  - AdminController                              │
│  - PINController                                │
│  - CSRRepController                             │
│  - RequestController                            │
└─────────────────────────────────────────────────┘
                      ↓ Business Logic
┌─────────────────────────────────────────────────┐
│         SERVICE LAYER (Business Logic)          │
│  - UserService                                  │
│  - MatchingService                              │
│  - CSROpportunityService                        │
└─────────────────────────────────────────────────┘
                      ↓ Data Access
┌─────────────────────────────────────────────────┐
│      REPOSITORY LAYER (Data Access)             │
│  - UserRepository                               │
│  - VolunteerRepository                          │
│  - MatchingRepository                           │
└─────────────────────────────────────────────────┘
                      ↓ ORM
┌─────────────────────────────────────────────────┐
│           ENTITY LAYER (Database)               │
│  - User, PIN, CSRRep                           │
│  - Request, Match, Shortlist                    │
│  - Notification, ServiceCategory                │
└─────────────────────────────────────────────────┘
```

---

## 📚 Core Entities Reference

### User Management
- **User**: Base user entity with authentication
- **PIN**: Person-in-Need profile
- **CSRRep**: CSR Representative profile
- **PlatformManager**: Platform administrator profile

### Request & Matching
- **Request**: Help request from PIN
- **ServiceCategory**: Request categorization
- **Shortlist**: CSR Rep saved requests
- **VolunteerOffer**: CSR Rep offer to help
- **Match**: Confirmed PIN-CSR pairing

### Communication
- **Notification**: System notifications

---

## 🔄 Key Workflows

### 1. User Registration Flow
```
User → LoginPage → AuthService → AuthController 
→ UserService → Prisma → Database
```

### 2. Request Creation Flow
```
PIN → RequestForm → RequestService → RequestController 
→ Request Entity → Database
```

### 3. Matching Flow
```
CSR Rep → RequestList → shortlist/offer 
→ CSRRepController → MatchingService → Match Entity
```

---

## 📖 Reading the Diagrams

### Class Notation
```
┌─────────────────┐
│   ClassName     │  ← Class Name
├─────────────────┤
│ - privateField  │  ← Private attribute (-)
│ + publicField   │  ← Public attribute (+)
├─────────────────┤
│ + method()      │  ← Public method
│ - helperMethod()│  ← Private method
└─────────────────┘
```

### Relationship Types
- **Association** (`-->`): One class uses another
- **Inheritance** (`--|>`): One class extends another
- **Aggregation** (`--o`): Has-a relationship (can exist independently)
- **Composition** (`--*`): Part-of relationship (cannot exist independently)

### Multiplicity
- `1`: Exactly one
- `0..1`: Zero or one
- `0..*` or `*`: Zero or many
- `1..*`: One or many

---

## 🎨 Color Coding (for visual diagrams)

If you generate colored diagrams:
- 🟦 **Blue**: Boundary Layer (UI Components)
- 🟩 **Green**: Controller Layer (API Handlers)
- 🟨 **Yellow**: Service Layer (Business Logic)
- 🟧 **Orange**: Repository Layer (Data Access)
- 🟥 **Red**: Entity Layer (Database Models)

---

## 🛠️ Tools & Resources

### Diagram Rendering Tools

1. **PlantUML**
   - Online: https://www.planttext.com/
   - Desktop: https://plantuml.com/download
   - VS Code Extension: PlantUML

2. **Mermaid**
   - Online: https://mermaid.live/
   - GitHub: Automatic rendering
   - VS Code Extension: Markdown Preview Mermaid Support

3. **UML Tools**
   - draw.io: https://app.diagrams.net/
   - Lucidchart: https://www.lucidchart.com/
   - StarUML: https://staruml.io/

### Learning Resources

1. **UML Basics**
   - https://www.uml-diagrams.org/
   - https://www.visual-paradigm.com/guide/uml-unified-modeling-language/

2. **PlantUML Guide**
   - https://plantuml.com/class-diagram
   - https://crashedmind.github.io/PlantUMLHitchhikersGuide/

3. **Mermaid Documentation**
   - https://mermaid-js.github.io/mermaid/
   - https://mermaid.js.org/syntax/classDiagram.html

---

## 📝 How to Use for Your Project

### For Documentation
1. Include in project README
2. Reference in architecture documentation
3. Add to project wiki

### For Development
1. Use as reference when coding
2. Guide for new team members
3. Template for new features

### For Academic Submission
1. Include in design document
2. Explain BCE architecture
3. Show system structure

### For Presentations
1. Generate high-quality images
2. Use in slide decks
3. Demonstrate architecture

---

## 🔍 Finding Specific Information

### Looking for Entity Relationships?
→ See **Entity Relationship Diagram** in CLASS_DIAGRAMS_MERMAID.md

### Looking for API Handlers?
→ See **Controller Class Diagram** in both files

### Looking for Business Logic?
→ See **Service Layer Diagram** in CLASS_DIAGRAMS_MERMAID.md

### Looking for Frontend Components?
→ See **Frontend Component Architecture** in CLASS_DIAGRAMS_MERMAID.md

### Looking for Data Flow?
→ See **Sequence Diagrams** in CLASS_DIAGRAMS_MERMAID.md

### Looking for Complete System View?
→ See **Complete BCE Architecture** in CLASS_DIAGRAMS.md

---

## 🚀 Next Steps

1. **View the Diagrams**
   - Start with CLASS_DIAGRAMS_MERMAID.md on GitHub
   - Use online viewers for CLASS_DIAGRAMS.md

2. **Understand the Architecture**
   - Read BCE_ARCHITECTURE.md for detailed explanation
   - Study the workflow diagrams

3. **Generate Images** (if needed)
   ```bash
   plantuml CLASS_DIAGRAMS.md
   ```

4. **Customize for Your Needs**
   - Modify diagrams as system evolves
   - Add new components
   - Update relationships

---

## 📞 Support

### Need Help?
- Check existing documentation in the repo
- Review BCE_ARCHITECTURE.md for architecture details
- See API_DOCUMENTATION.md for API details

### Want to Contribute?
- Update diagrams when adding features
- Keep diagrams in sync with code
- Add new diagrams for new modules

---

## ✅ Checklist for Using Diagrams

- [ ] Reviewed both diagram files
- [ ] Understood BCE architecture pattern
- [ ] Can identify entity relationships
- [ ] Can trace request flow through layers
- [ ] Can explain controller responsibilities
- [ ] Can describe service layer purpose
- [ ] Generated images for documentation (if needed)
- [ ] Included diagrams in project submission

---

## 📊 Diagram Statistics

- **Total Diagrams**: 11
- **Entity Classes**: 10
- **Controller Classes**: 6
- **Service Classes**: 5
- **Repository Interfaces**: 5
- **Frontend Components**: 4
- **Sequence Diagrams**: 3

---

Last Updated: $(date)
Maintained by: Development Team

