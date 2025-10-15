# Class Diagrams & ERD Documentation

**CSR Volunteer Matching System - UML Class Diagrams and Entity Relationship Diagrams**

---

## 📊 Available Diagrams

### 1. **CLASS_DIAGRAMS.md** (PlantUML Format)
**Format:** PlantUML  
**Best for:** Academic submissions, professional documentation, generating images

**Contains:**
- ✅ Entity Relationship Diagram (ERD)
- ✅ Entity Layer Class Diagram
- ✅ Controller Layer Class Diagram
- ✅ Service Layer Class Diagram

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
- ✅ Entity Layer Class Diagram
- ✅ Controller Layer Class Diagram
- ✅ Service Layer Class Diagram

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
- Shows all tables and relationships
- Includes primary keys, foreign keys, and unique constraints
- Demonstrates cardinality (1:1, 1:many, many:many)

### Class Diagrams

#### 1. Entity Layer
- All database entities (User, PIN, CSRRep, etc.)
- Entity attributes and methods
- Relationships between entities
- Enum definitions

#### 2. Controller Layer
- All API controllers (AuthController, AdminController, etc.)
- Controller methods and responsibilities
- HTTP request handling

#### 3. Service Layer
- Service classes (UserService, MatchingService, etc.)
- Repository interfaces
- Business logic patterns
- Dependency injection

---

## 📊 Diagram Types

| Diagram Type | In PlantUML File | In Mermaid File |
|--------------|-----------------|-----------------|
| **ERD** | ✅ | ✅ |
| **Entity Classes** | ✅ | ✅ |
| **Controller Classes** | ✅ | ✅ |
| **Service Classes** | ✅ | ✅ |

---

## 🎓 For Academic Submission

### Recommended Approach

1. **Generate Images from PlantUML:**
   ```bash
   plantuml -tsvg CLASS_DIAGRAMS.md
   ```

2. **Include in Report:**
   - Figure 1: Entity Relationship Diagram (ERD)
   - Figure 2: Entity Layer Class Diagram
   - Figure 3: Controller Layer Class Diagram
   - Figure 4: Service Layer Class Diagram

3. **Add Descriptions:**
   - Explain each diagram's purpose
   - Describe key relationships
   - Reference in your design section

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
- [ ] Include class diagrams in system design section
- [ ] Add captions and explanations
- [ ] Reference diagrams in text

### For Development
- [ ] Understand entity relationships from ERD
- [ ] Reference controller methods
- [ ] Review service layer patterns
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

---

## 🎯 Use Cases

| I want to... | Use this file |
|--------------|---------------|
| View on GitHub | CLASS_DIAGRAMS_MERMAID.md |
| Generate images | CLASS_DIAGRAMS.md |
| See database schema | ERD in either file |
| Understand entities | Entity Class Diagram in either file |
| See API structure | Controller Class Diagram in either file |
| Review business logic | Service Layer Diagram in either file |

---

**Last Updated:** 2024  
**Maintained By:** Development Team  
**Status:** ✅ Complete - ERD and Class Diagrams Only
