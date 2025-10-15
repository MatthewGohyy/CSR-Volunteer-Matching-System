# 📊 Class Diagrams - Complete Index

**CSR Volunteer Matching System - UML & Architecture Documentation**

---

## 🎯 What You Need

| I want to... | Go to... |
|--------------|----------|
| 📖 **Understand the basics** | [Quick Start](#quick-start) |
| 🎨 **View diagrams on GitHub** | [CLASS_DIAGRAMS_MERMAID.md](./CLASS_DIAGRAMS_MERMAID.md) |
| 📐 **Get professional UML diagrams** | [CLASS_DIAGRAMS.md](./CLASS_DIAGRAMS.md) |
| ⚡ **Quick reference/cheat sheet** | [CLASS_DIAGRAM_CHEATSHEET.md](./CLASS_DIAGRAM_CHEATSHEET.md) |
| 📚 **Learn how to use the diagrams** | [DIAGRAMS_README.md](./DIAGRAMS_README.md) |
| 🏗️ **Understand BCE architecture** | [BCE_ARCHITECTURE.md](./BCE_ARCHITECTURE.md) |
| 🔌 **See API endpoints** | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) |

---

## 📁 All Diagram Files

### 1. **CLASS_DIAGRAMS.md** ⭐
**Format:** PlantUML  
**Best for:** Academic submissions, professional documentation, detailed analysis

**Contains:**
- ✅ Complete Entity Layer Diagram (10+ entities)
- ✅ Controller Layer Diagram (6 controllers)
- ✅ Service & Repository Layer Diagram (5+ services)
- ✅ Complete BCE Architecture Diagram
- ✅ Frontend Component Class Diagram

**How to view:**
- Online: [PlantText](https://www.planttext.com/)
- Desktop: PlantUML tool
- Generate images: `plantuml CLASS_DIAGRAMS.md`

---

### 2. **CLASS_DIAGRAMS_MERMAID.md** 🌟
**Format:** Mermaid  
**Best for:** GitHub viewing, quick reference, team collaboration

**Contains:**
- ✅ Entity Relationship Diagram
- ✅ Controller Class Diagram
- ✅ Service Layer Diagram
- ✅ System Architecture Overview
- ✅ Frontend Component Architecture
- ✅ Sequence Diagrams (Login, User Creation, Request Matching)
- ✅ Enum Definitions

**How to view:**
- GitHub: Renders automatically ✨
- Online: [Mermaid Live](https://mermaid.live/)
- VS Code: Install "Markdown Preview Mermaid Support"

---

### 3. **CLASS_DIAGRAM_CHEATSHEET.md** ⚡
**Format:** Markdown with ASCII art  
**Best for:** Quick reference, development guide, code assistance

**Contains:**
- ✅ BCE Layer Structure
- ✅ Core Entity Reference Cards
- ✅ Controller Method Signatures
- ✅ Service Method Patterns
- ✅ Repository Interfaces
- ✅ Enum Quick Reference
- ✅ Request Flow Examples
- ✅ Common API Operations

**How to use:**
- Keep open while coding
- Reference for method names
- Quick lookup for relationships

---

### 4. **DIAGRAMS_README.md** 📚
**Format:** Markdown guide  
**Best for:** Learning how to use diagrams, understanding notation

**Contains:**
- ✅ How to read UML diagrams
- ✅ Symbol and notation guide
- ✅ Tool installation instructions
- ✅ Workflow explanations
- ✅ Color coding reference
- ✅ Learning resources
- ✅ Usage checklist

**How to use:**
- Start here if new to UML
- Reference for diagram symbols
- Guide for generating images

---

## 🚀 Quick Start

### Step 1: Choose Your Format

**For GitHub viewing (Easiest):**
```bash
# Just open this file on GitHub
open CLASS_DIAGRAMS_MERMAID.md
```

**For professional documentation:**
```bash
# Use PlantUML diagrams
open CLASS_DIAGRAMS.md
# Then use planttext.com to render
```

**For quick reference while coding:**
```bash
# Open the cheat sheet
open CLASS_DIAGRAM_CHEATSHEET.md
```

### Step 2: Understand the Architecture

```
1. Read: DIAGRAMS_README.md (Understanding)
   ↓
2. View: CLASS_DIAGRAMS_MERMAID.md (Visual Overview)
   ↓
3. Deep Dive: CLASS_DIAGRAMS.md (Detailed UML)
   ↓
4. Reference: CLASS_DIAGRAM_CHEATSHEET.md (Quick Lookup)
```

### Step 3: Use for Your Task

| Task | Recommended Files |
|------|------------------|
| **Code new feature** | Cheatsheet + Mermaid |
| **Write documentation** | PlantUML + README |
| **Explain to team** | Mermaid diagrams |
| **Academic submission** | PlantUML + generate images |
| **Code review** | Cheatsheet for reference |

---

## 📊 Diagram Types Breakdown

### Entity Diagrams
**Show:** Database models, relationships, attributes, methods

**Files:** 
- [CLASS_DIAGRAMS.md](./CLASS_DIAGRAMS.md#1-entity-layer-class-diagram)
- [CLASS_DIAGRAMS_MERMAID.md](./CLASS_DIAGRAMS_MERMAID.md#1-entity-relationship-diagram)

**Entities Covered:**
- User, PIN, CSRRep, PlatformManager
- Request, ServiceCategory
- Shortlist, VolunteerOffer, Match
- Notification

---

### Controller Diagrams
**Show:** API handlers, HTTP methods, business logic flow

**Files:**
- [CLASS_DIAGRAMS.md](./CLASS_DIAGRAMS.md#2-controller-layer-class-diagram)
- [CLASS_DIAGRAMS_MERMAID.md](./CLASS_DIAGRAMS_MERMAID.md#2-controller-class-diagram)

**Controllers Covered:**
- AuthController (login, registration)
- AdminController (user management)
- PINController (PIN operations)
- CSRRepController (CSR operations)
- RequestController (request CRUD)
- MatchController (matching logic)

---

### Service & Repository Diagrams
**Show:** Business logic, data access patterns

**Files:**
- [CLASS_DIAGRAMS.md](./CLASS_DIAGRAMS.md#3-service--repository-layer-class-diagram)
- [CLASS_DIAGRAMS_MERMAID.md](./CLASS_DIAGRAMS_MERMAID.md#3-service-layer-diagram)

**Services Covered:**
- UserService
- VolunteerService
- OrganizationService
- CSROpportunityService
- MatchingService

---

### Architecture Diagrams
**Show:** Complete system structure, layer interactions

**Files:**
- [CLASS_DIAGRAMS.md](./CLASS_DIAGRAMS.md#4-complete-bce-architecture-diagram)
- [CLASS_DIAGRAMS_MERMAID.md](./CLASS_DIAGRAMS_MERMAID.md#4-system-architecture-overview)

**Layers Shown:**
- Boundary (Frontend Components)
- Controller (API Handlers)
- Service (Business Logic)
- Entity (Database Models)

---

### Sequence Diagrams
**Show:** Request flows, interaction patterns

**Files:**
- [CLASS_DIAGRAMS_MERMAID.md](./CLASS_DIAGRAMS_MERMAID.md#6-request-flow-sequence)

**Flows Covered:**
- User Login Flow
- User Creation Flow
- Request Matching Flow

---

### Frontend Diagrams
**Show:** React components, service classes

**Files:**
- [CLASS_DIAGRAMS.md](./CLASS_DIAGRAMS.md#5-frontend-component-class-diagram)
- [CLASS_DIAGRAMS_MERMAID.md](./CLASS_DIAGRAMS_MERMAID.md#5-frontend-component-architecture)

**Components Covered:**
- LoginPage
- AdminDashboard
- CreateUserModal
- UserDetailsModal
- Service Classes (AuthService, AdminService, etc.)

---

## 🛠️ Tools & Setup

### Viewing Diagrams

#### Option 1: GitHub (Mermaid only)
```bash
# Just push and view on GitHub
git add CLASS_DIAGRAMS_MERMAID.md
git commit -m "Add Mermaid diagrams"
git push
# Open on GitHub - diagrams render automatically!
```

#### Option 2: VS Code
```bash
# Install extensions
code --install-extension jebbs.plantuml
code --install-extension bierner.markdown-mermaid

# Open files and preview
code CLASS_DIAGRAMS.md
code CLASS_DIAGRAMS_MERMAID.md
# Press Cmd+Shift+V (Mac) or Ctrl+Shift+V (Windows) to preview
```

#### Option 3: Online Viewers
**PlantUML:**
- https://www.planttext.com/
- https://plantuml.com/

**Mermaid:**
- https://mermaid.live/
- https://mermaid-js.github.io/mermaid-live-editor/

### Generating Images

#### PlantUML to PNG/SVG
```bash
# Install PlantUML
brew install plantuml  # macOS
sudo apt-get install plantuml  # Linux

# Generate images
plantuml CLASS_DIAGRAMS.md
# Creates: CLASS_DIAGRAMS_*.png files

# Generate SVG (scalable)
plantuml -tsvg CLASS_DIAGRAMS.md
```

#### Mermaid to PNG
```bash
# Install mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Generate images
mmdc -i CLASS_DIAGRAMS_MERMAID.md -o diagrams.png
```

---

## 📖 Learning Path

### For Beginners
1. **Start:** [DIAGRAMS_README.md](./DIAGRAMS_README.md) - Learn the basics
2. **Visual:** [CLASS_DIAGRAMS_MERMAID.md](./CLASS_DIAGRAMS_MERMAID.md) - See the system
3. **Reference:** [CLASS_DIAGRAM_CHEATSHEET.md](./CLASS_DIAGRAM_CHEATSHEET.md) - Quick lookup

### For Developers
1. **Quick Start:** [CLASS_DIAGRAM_CHEATSHEET.md](./CLASS_DIAGRAM_CHEATSHEET.md) - Fast reference
2. **Architecture:** [BCE_ARCHITECTURE.md](./BCE_ARCHITECTURE.md) - Understand patterns
3. **Deep Dive:** [CLASS_DIAGRAMS.md](./CLASS_DIAGRAMS.md) - Detailed UML

### For Documentation
1. **Professional:** [CLASS_DIAGRAMS.md](./CLASS_DIAGRAMS.md) - Generate images
2. **Guide:** [DIAGRAMS_README.md](./DIAGRAMS_README.md) - Explain diagrams
3. **Reference:** All files for complete picture

---

## 🎓 For Academic Submission

### Required Elements Checklist
- [ ] System architecture diagram ✅ (In CLASS_DIAGRAMS.md)
- [ ] Entity relationship diagram ✅ (In both files)
- [ ] Class diagrams ✅ (In both files)
- [ ] Sequence diagrams ✅ (In CLASS_DIAGRAMS_MERMAID.md)
- [ ] Component diagrams ✅ (In both files)
- [ ] BCE pattern demonstrated ✅ (In CLASS_DIAGRAMS.md)

### How to Include in Report
```bash
# 1. Generate high-quality images
plantuml -tsvg CLASS_DIAGRAMS.md

# 2. Or export from online viewers
# - Go to planttext.com
# - Paste diagram code
# - Download as PNG/SVG

# 3. Include in Word/LaTeX with captions
# Figure 1: System Architecture (BCE Pattern)
# Figure 2: Entity Relationship Diagram
# Figure 3: Controller Layer Class Diagram
# etc.
```

### Suggested Report Structure
```
1. Introduction
2. System Architecture
   2.1 BCE Architecture Overview (diagram)
   2.2 Layer Descriptions
3. System Design
   3.1 Entity Layer (diagram + explanation)
   3.2 Controller Layer (diagram + explanation)
   3.3 Service Layer (diagram + explanation)
4. Detailed Design
   4.1 Class Diagrams (detailed UML)
   4.2 Sequence Diagrams (key workflows)
5. Implementation
   5.1 Frontend Components (diagram)
   5.2 API Endpoints (reference)
```

---

## 🔍 Finding Specific Information

### "Where is the User entity defined?"
→ [CLASS_DIAGRAMS.md - Entity Layer](./CLASS_DIAGRAMS.md#1-entity-layer-class-diagram)  
→ [Cheatsheet - User Entities](./CLASS_DIAGRAM_CHEATSHEET.md#-user-entities)

### "What methods does AdminController have?"
→ [CLASS_DIAGRAMS.md - Controller Layer](./CLASS_DIAGRAMS.md#2-controller-layer-class-diagram)  
→ [Cheatsheet - AdminController](./CLASS_DIAGRAM_CHEATSHEET.md#admincontroller)

### "How does the login flow work?"
→ [CLASS_DIAGRAMS_MERMAID.md - Login Sequence](./CLASS_DIAGRAMS_MERMAID.md#6-request-flow-sequence)  
→ [Cheatsheet - User Login](./CLASS_DIAGRAM_CHEATSHEET.md#1-user-login)

### "What are the relationships between entities?"
→ [CLASS_DIAGRAMS_MERMAID.md - Entity Diagram](./CLASS_DIAGRAMS_MERMAID.md#1-entity-relationship-diagram)  
→ [Cheatsheet - Key Relationships](./CLASS_DIAGRAM_CHEATSHEET.md#-key-relationships)

### "How is the BCE pattern implemented?"
→ [CLASS_DIAGRAMS.md - BCE Architecture](./CLASS_DIAGRAMS.md#4-complete-bce-architecture-diagram)  
→ [DIAGRAMS_README.md - Architecture](./DIAGRAMS_README.md#-system-architecture-overview)

---

## 📊 Statistics

### Documentation Coverage
- **Total Diagrams:** 11+
- **Entity Classes:** 10
- **Controllers:** 6
- **Services:** 5
- **Frontend Components:** 4
- **Sequence Diagrams:** 3
- **Architecture Diagrams:** 2

### File Sizes
- CLASS_DIAGRAMS.md: ~500 lines (comprehensive)
- CLASS_DIAGRAMS_MERMAID.md: ~600 lines (visual)
- CLASS_DIAGRAM_CHEATSHEET.md: ~400 lines (reference)
- DIAGRAMS_README.md: ~300 lines (guide)

---

## ✅ Usage Checklist

### For Development
- [ ] Reviewed entity relationships
- [ ] Understand controller responsibilities
- [ ] Know service layer patterns
- [ ] Familiar with API structure
- [ ] Can trace request flows

### For Documentation
- [ ] Generated diagram images
- [ ] Understand UML notation
- [ ] Can explain BCE pattern
- [ ] Have sequence diagrams
- [ ] Include in project docs

### For Presentation
- [ ] Architecture overview ready
- [ ] Key diagrams identified
- [ ] Can explain workflows
- [ ] Have high-quality images
- [ ] Practice explanations

---

## 🚧 Maintenance

### When to Update Diagrams
- ✏️ Adding new entity → Update Entity Diagram
- ✏️ New controller → Update Controller Diagram
- ✏️ New service → Update Service Diagram
- ✏️ New workflow → Add Sequence Diagram
- ✏️ Architecture change → Update BCE Diagram

### How to Update
1. Edit the appropriate .md file
2. Update PlantUML or Mermaid code
3. Regenerate images (if needed)
4. Update cheatsheet
5. Commit changes

---

## 📞 Support & Resources

### Internal Documentation
- [README.md](./README.md) - Project overview
- [BCE_ARCHITECTURE.md](./BCE_ARCHITECTURE.md) - Architecture guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

### External Resources
- **UML:** https://www.uml-diagrams.org/
- **PlantUML:** https://plantuml.com/
- **Mermaid:** https://mermaid-js.github.io/
- **BCE Pattern:** See BCE_ARCHITECTURE.md

---

## 🎯 Quick Access Links

| Category | File | Quick Link |
|----------|------|------------|
| 🎨 **Visual** | Mermaid Diagrams | [VIEW](./CLASS_DIAGRAMS_MERMAID.md) |
| 📐 **Professional** | PlantUML Diagrams | [VIEW](./CLASS_DIAGRAMS.md) |
| ⚡ **Quick Ref** | Cheat Sheet | [VIEW](./CLASS_DIAGRAM_CHEATSHEET.md) |
| 📚 **Guide** | How-to Use | [VIEW](./DIAGRAMS_README.md) |
| 🏗️ **Architecture** | BCE Guide | [VIEW](./BCE_ARCHITECTURE.md) |
| 🔌 **API** | API Docs | [VIEW](./API_DOCUMENTATION.md) |

---

## 💡 Pro Tips

1. **Start with Mermaid** for quick understanding
2. **Use Cheatsheet** while coding
3. **Generate PlantUML images** for reports
4. **Keep diagrams updated** with code changes
5. **Reference during code reviews**
6. **Include in onboarding** for new team members

---

**Last Updated:** $(date)  
**Maintained By:** Development Team  
**Version:** 1.0

---

**Need help?** See [DIAGRAMS_README.md](./DIAGRAMS_README.md) for detailed instructions!

