# Class Diagrams & ERD Documentation

**CSR Volunteer Matching System - UML Class Diagrams and Entity Relationship Diagrams**

---

## 📊 Available Diagrams

### 1. **CLASS_DIAGRAMS.md** (PlantUML Format)
**Format:** PlantUML  
**Best for:** Academic submissions, professional documentation, generating images

**Contains:**
- ✅ Entity Relationship Diagram (ERD)
- ✅ Entity Class Diagram (Repository Pattern)
- ✅ Controller Class Diagram

**How to view:**
- Online: [PlantText](https://www.planttext.com/) or [PlantUML Web Server](http://www.plantuml.com/plantuml/uml/)
- Desktop: PlantUML tool
- Generate images: `plantuml CLASS_DIAGRAMS.md`

---

### 2. **CLASS_DIAGRAMS_MERMAID.md** (Mermaid Format)
**Format:** Mermaid  
**Best for:** GitHub viewing (renders automatically!)

**Contains:**
- ✅ Entity Relationship Diagram (ERD)
- ✅ Entity Class Diagram (Repository Pattern)
- ✅ Controller Class Diagram
- ✅ BCE Architecture Diagram

**How to view:**
- GitHub: Renders automatically ✨
- Online: [Mermaid Live](https://mermaid.live/)
- VS Code: Install "Markdown Preview Mermaid Support" extension

---

## 🚀 Quick Start

### View on GitHub (Easiest)
```bash
# Just open on GitHub - Mermaid diagrams render automatically
open CLASS_DIAGRAMS_MERMAID.md  # on GitHub
```

### Generate Images for Reports
```bash
# Install PlantUML
brew install plantuml  # macOS
# or
sudo apt-get install plantuml  # Linux

# Generate PNG images
plantuml CLASS_DIAGRAMS.md

# Generate SVG (better quality)
plantuml -tsvg CLASS_DIAGRAMS.md
```

---

## 📚 What's Included

### Entity Relationship Diagram (ERD)
- Database schema visualization
- Shows all 11 tables and relationships
- Includes primary keys, foreign keys, and unique constraints
- Demonstrates cardinality (1:1, 1:many)

**⚠️ Important:** The User table supports 4 user types (PIN, CSR_REP, ADMIN, PLATFORM_MANAGER), but ADMIN users have NO separate profile table. Only PIN, CSRRep, and PlatformManager have profile tables.

### Class Diagrams

#### 1. Entity Class Diagram (Repository Pattern)
- **10 Entity classes** in `server/src/entities/`
- Shows instance methods (business logic) and static methods (CRUD)
- Repository Pattern implementation
- Relationships between entities
- Demonstrates how entities encapsulate data access

**Key Entities:**
- UserEntity
- RequestEntity  
- PINEntity
- CSRRepEntity
- PlatformManagerEntity
- MatchEntity
- ServiceCategoryEntity
- ShortlistEntity
- VolunteerOfferEntity
- NotificationEntity

#### 2. Controller Class Diagram
- **58 controller files** organized by feature
- Shows how controllers call Entity classes
- Dependencies on Entity classes
- HTTP request handling

**Controller Packages:**
- Auth Controllers (6 files)
- User Admin Controllers (14 files)
- PIN Controllers (15 files)
- CSR Rep Controllers (12 files)
- Platform Manager Controllers (8 files)
- Match Controller

---

## 📊 Diagram Types

| Diagram Type | In PlantUML File | In Mermaid File |
|--------------|-----------------|-----------------|
| **ERD** | ✅ | ✅ |
| **Entity Classes (Repository Pattern)** | ✅ | ✅ |
| **Controller Classes** | ✅ | ✅ |
| **BCE Architecture** | ❌ | ✅ |

---

## 🎓 For Academic Submission

### Recommended Approach

1. **Generate Images from PlantUML:**
   ```bash
   plantuml -tsvg CLASS_DIAGRAMS.md
   ```

2. **Include in Report:**
   - **Figure 1:** Entity Relationship Diagram (ERD) - Database schema
   - **Figure 2:** Entity Class Diagram - Domain models with Repository Pattern
   - **Figure 3:** Controller Class Diagram - Request handling and business logic

3. **Add Descriptions:**
   - **ERD:** Explain database relationships, user types, key constraints
   - **Entity Classes:** Explain Repository Pattern, instance vs static methods
   - **Controllers:** Explain how controllers orchestrate entity operations

---

## 🛠️ Tools & Viewing

### Online Viewers

**PlantUML:**
- https://www.planttext.com/
- https://plantuml.com/

**Mermaid:**
- https://mermaid.live/
- Automatic on GitHub

### VS Code Extensions
```bash
# For PlantUML
code --install-extension jebbs.plantuml

# For Mermaid
code --install-extension bierner.markdown-mermaid
```

### Command Line
```bash
# Install PlantUML (macOS)
brew install plantuml

# Install PlantUML (Linux)
sudo apt-get install plantuml

# Generate all diagrams as PNG
plantuml CLASS_DIAGRAMS.md

# Generate as SVG (scalable)
plantuml -tsvg CLASS_DIAGRAMS.md
```

---

## 📝 File Locations

```
CSR-Volunteer-Matching-System/
├── CLASS_DIAGRAMS_INDEX.md          ← You are here
├── CLASS_DIAGRAMS.md                 ← PlantUML diagrams
└── CLASS_DIAGRAMS_MERMAID.md         ← Mermaid diagrams
```

---

## ✅ Quick Checklist

### For Viewing
- [ ] Open CLASS_DIAGRAMS_MERMAID.md on GitHub
- [ ] Or use PlantText for CLASS_DIAGRAMS.md
- [ ] Install VS Code extensions for local viewing

### For Academic Submission
- [ ] Generate images: `plantuml -tsvg CLASS_DIAGRAMS.md`
- [ ] Include ERD in database design section
- [ ] Include Entity class diagram - explain Repository Pattern
- [ ] Include Controller class diagram
- [ ] Add captions and explanations
- [ ] Reference diagrams in text

### For Development
- [ ] Understand entity relationships from ERD
- [ ] Review Entity class methods (business logic + CRUD)
- [ ] Reference controller operations
- [ ] Use as coding reference

---

## 📖 Understanding the Diagrams

### ERD Symbols
- **PK** = Primary Key (unique identifier)
- **FK** = Foreign Key (references another table)
- **UK** = Unique Key (must be unique)
- `||--o{` = One to many relationship
- `||--||` = One to one relationship
- `||--o|` = One to zero or one relationship

### Class Diagram Symbols
- `+` = Public method/attribute
- `-` = Private method/attribute
- `#` = Protected method/attribute
- `{static}` = Static method
- Solid lines = Strong relationships
- Dashed lines = Dependencies

### Repository Pattern in Entity Classes
- **Instance methods** (lowercase): Business logic - `isActive()`, `isPIN()`, `toJSON()`
- **Static methods** (with {static}): Data access - `findById()`, `create()`, `update()`

---

## 🎯 Use Cases

| I want to... | Use this file |
|--------------|---------------|
| View on GitHub | CLASS_DIAGRAMS_MERMAID.md |
| Generate images for report | CLASS_DIAGRAMS.md (PlantUML) |
| See database schema | ERD in either file |
| Understand entity classes | Entity Class Diagram in either file |
| See Repository Pattern | Entity Class Diagram - note static vs instance methods |
| See API structure | Controller Class Diagram in either file |
| Understand BCE architecture | BCE diagram in MERMAID file only |

---

## 💡 Key Insights

### Repository Pattern
Entity classes implement the Repository Pattern:
- **Encapsulate data access**: All Prisma calls are inside entities
- **Provide business logic**: Instance methods like `isActive()`, `isPIN()`
- **Type-safe operations**: Return entity instances, not raw data
- **Reusable**: Static methods like `findById()` used across controllers

### Architecture Flow
```
Controller → Entity Class → Prisma ORM → Database

Example:
LoginController.handle()
  ↓ calls
UserEntity.findByEmail(email)
  ↓ uses
prisma.user.findUnique()
  ↓ queries
PostgreSQL Database
```

---

## 📐 Architecture Notes

### No Service Layer
This codebase does **NOT** have a separate service layer:
- ✅ Controllers call Entity classes directly
- ✅ Entity classes act as repositories
- ❌ No intermediate service classes

### Entity Classes = Repositories
The `entities/` folder contains classes that:
1. Represent domain models
2. Contain business logic (instance methods)
3. Provide data access (static methods)
4. Use Prisma ORM internally

---

**Last Updated:** October 22, 2025  
**Maintained By:** Development Team  
**Status:** ✅ Complete and Accurate
