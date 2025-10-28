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

### UserAccount/UserProfile Design (Single Table Inheritance)

The diagrams reflect the **actual implementation** using Single Table Inheritance pattern:

1. **UserProfile Table** (4 static records):
   - PIN ("Person in Need")
   - CSR_REP ("CSR Representative")
   - USER_ADMIN ("User Administrator")
   - PLATFORM_MANAGER ("Platform Manager")

2. **UserAccount Table** (ONE table for all users):
   - References one of the 4 UserProfile records
   - Contains authentication credentials
   - Has personal information (name, email, phone, etc.)
   - **Contains ALL role-specific fields in ONE table:**
     - PIN fields: age, location, accessibilityNeeds, profilePhoto
     - CSR fields: companyName, companyRegistrationNumber, industry, etc.
     - Platform Manager fields: department
   - Unused fields are NULL for each user type

3. **No Separate Profile Tables**:
   - No separate PIN/CSRRep/PlatformManager tables
   - All data stored in UserAccount with nullable fields
   - Role determined by userProfile reference

### Key Relationships

```
UserProfile (1) ──── (M) UserAccount
UserAccount (1) ──── (M) Request (when role = PIN)
UserAccount (1) ──── (M) Shortlist (when role = CSR_REP)
UserAccount (1) ──── (M) VolunteerOffer (when role = CSR_REP)
UserAccount (1) ──── (M) Match (as PIN or CSR_REP)
Request (1) ──── (0..1) Match
```

**Note:** No separate PIN/CSRRep/PlatformManager tables. Role determined by `userProfile` reference.

## 📝 Notes

- **Single Table Inheritance**: All user types stored in ONE UserAccount table
- **M:1 Cardinality**: Many UserAccounts reference one UserProfile (4 static records)
- **Role Determination**: UserProfile reference determines which fields are used
- **Nullable Fields**: Each user only uses relevant fields; others are NULL
- **Unique Constraints**: Marked with `<<UNIQUE>>` in PlantUML, `UK` in Mermaid
- **Foreign Keys**: Marked with `<<FK>>` in PlantUML, `FK` in Mermaid

For detailed explanation, see [DESIGN_PATTERN.md](./DESIGN_PATTERN.md)

## 🔄 Keeping Diagrams Updated

When making schema changes:
1. Update `prisma/schema.prisma`
2. Update both PlantUML and Mermaid versions
3. Regenerate diagram images
4. Update this README if needed

---

**Last Updated:** October 28, 2025
**Design Version:** UserAccount/UserProfile Refactored
