# CSR Volunteer Matching System - Diagrams

This directory contains comprehensive diagrams for the CSR Volunteer Matching System using the **refactored UserAccount/UserProfile design**.

## 📊 Available Diagrams

### 1. Class Diagram
Shows the object-oriented design with classes, attributes, methods, and relationships.

- **PlantUML**: `class-diagram.puml`
- **Mermaid**: `class-diagram.mmd`

**Key Features:**
- UserAccount and UserProfile separation
- Rich domain models with business logic methods
- Static CRUD methods (Repository Pattern)
- All entity classes and enums
- Comprehensive relationships

### 2. ERD (Entity Relationship Diagram)
Shows the database schema with tables, columns, keys, and relationships.

- **PlantUML**: `erd-diagram.puml`
- **Mermaid**: `erd-diagram.mmd`

**Key Features:**
- UserProfile with 4 static records
- UserAccount as main authentication table
- All foreign key relationships
- Unique constraints
- Cardinality notation

## 🚀 How to Use

### PlantUML (`.puml` files)

**Online:**
1. Copy the content
2. Paste into [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
3. View or export as PNG/SVG

**VS Code:**
1. Install "PlantUML" extension
2. Open `.puml` file
3. Press `Alt+D` to preview

**Command Line:**
```bash
# Install PlantUML
brew install plantuml

# Generate PNG
plantuml class-diagram.puml
plantuml erd-diagram.puml
```

### Mermaid (`.mmd` files)

**Online:**
1. Copy the content
2. Paste into [Mermaid Live Editor](https://mermaid.live/)
3. View or export

**VS Code:**
1. Install "Markdown Preview Mermaid Support" extension
2. Create a markdown file with:
   ```markdown
   ```mermaid
   [paste content here]
   ```
   ```
3. Preview the markdown file

**GitHub:**
- GitHub natively renders Mermaid in markdown files
- Just include in a `.md` file within triple backticks

## 🎨 Diagram Highlights

### UserAccount/UserProfile Design

The diagrams reflect the refactored architecture where:

1. **UserProfile Table** (4 static records):
   - PIN
   - CSR_REP  
   - USER_ADMIN
   - PLATFORM_MANAGER

2. **UserAccount Table**:
   - References one of the 4 UserProfile records
   - Contains authentication credentials
   - Has personal information (name, email, phone, etc.)

3. **Profile Tables** (PIN, CSRRep, PlatformManager):
   - One-to-one relationship with UserAccount
   - Role-specific information

### Key Relationships

```
UserProfile (1) ──── (M) UserAccount
UserAccount (1) ──── (0..1) PIN
UserAccount (1) ──── (0..1) CSRRep
UserAccount (1) ──── (0..1) PlatformManager
PIN (1) ──── (M) Request
Request (1) ──── (1) Match
CSRRep (1) ──── (M) VolunteerOffer
```

## 📝 Notes

- **M:1 Cardinality**: Many UserAccounts reference one UserProfile
- **1:1 Relationships**: Each UserAccount has at most one profile (PIN or CSRRep or PlatformManager)
- **Unique Constraints**: Marked with `<<UNIQUE>>` in PlantUML, `UK` in Mermaid
- **Foreign Keys**: Marked with `<<FK>>` in PlantUML, `FK` in Mermaid

## 🔄 Keeping Diagrams Updated

When making schema changes:
1. Update `prisma/schema.prisma`
2. Update both PlantUML and Mermaid versions
3. Regenerate diagram images
4. Update this README if needed

---

**Last Updated:** October 28, 2025
**Design Version:** UserAccount/UserProfile Refactored
