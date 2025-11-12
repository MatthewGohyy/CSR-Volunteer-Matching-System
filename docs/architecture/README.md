# Architecture & Design Documentation

This directory contains system architecture documentation, design patterns, and class diagrams.

## 📄 Documents

### CLASS_DIAGRAM_COMPLETE_DOCUMENTATION.md
Complete documentation of the system's class diagram, including:
- All entity classes and their relationships
- Method references
- Data flow patterns
- Architecture patterns (BCE framework)

### DESIGN_PATTERN.md
Explanation of the Single Table Inheritance pattern used in the system, including:
- Pattern rationale
- Implementation details
- Benefits and trade-offs

## 🏗️ Architecture Overview

The system follows the **Boundary-Controller-Entity (BCE)** framework:
- **Boundary** - HTTP handlers (controllers)
- **Controller** - Business logic (services)
- **Entity** - Data models with static methods

### Key Design Patterns
- **Single Table Inheritance** - UserAccount with role-based profiles
- **Repository Pattern** - Static methods on entities for data access
- **Clean Architecture** - Separation of concerns

## 📊 Visual Diagrams

See the [../diagrams/](../diagrams/) directory for:
- ERD (Entity Relationship Diagrams)
- Class Diagrams
- Sprint-specific diagrams

## 📖 Related Documentation

- [API Documentation](../api/) - API endpoints and structure
- [Requirements](../requirements/) - User stories and system requirements

