# BCE Architecture Presentation
## CSR Volunteer Matching System

---

## Slide 1: What is BCE?

```
    ╔════════════════════════════════╗
    ║   B C E   A R C H I T E C T U R E   ║
    ╚════════════════════════════════╝

    🚪  B  =  BOUNDARY     (API Routes)
    
    🧠  C  =  CONTROL      (Business Logic)
    
    💾  E  =  ENTITY       (Data Models)
```

**Goal:** Separate concerns into clear, organized layers

---

## Slide 2: The Restaurant Analogy 🍴

```
┌─────────────────────────────────────────────┐
│                RESTAURANT                   │
└─────────────────────────────────────────────┘

   🚪  Waiter                  🚪  BOUNDARY
      ↓                           ↓
   Take order                 Receive API request
   Serve food                 Send response
   
   
   👨‍🍳  Chef                     🧠  CONTROL
      ↓                           ↓
   Follow recipe              Apply business rules
   Cook food                  Process data
   
   
   📦  Ingredients             💾  ENTITY
      ↓                           ↓
   Raw materials              Database models
   Recipes                    Data structure
```

**Each role has ONE job!**

---

## Slide 3: Real Example - User Login

```
┌─────────────────────────────────────┐
│  User enters: email & password      │
└───────────────┬─────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  🚪 BOUNDARY (routes/auth.ts)       │
│  POST /api/auth/login               │
└───────────────┬─────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  🧠 CONTROL (auth.controller.ts)    │
│  ✓ Check email exists               │
│  ✓ Verify password                  │
│  ✓ Generate token                   │
└───────────────┬─────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  💾 ENTITY (schema.prisma)          │
│  Query User table                   │
└───────────────┬─────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  ✅ User sees dashboard              │
└─────────────────────────────────────┘
```

---

## Slide 4: Our Project Structure

```
server/src/
│
├── 🚪 BOUNDARY
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── opportunities.ts
│   │   ├── volunteers.ts
│   │   └── matches.ts
│   └── validators/
│
├── 🧠 CONTROL
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── request.controller.ts
│   │   └── match.controller.ts
│   ├── middleware/
│   └── utils/
│
└── 💾 ENTITY
    └── prisma/
        └── schema.prisma
```

---

## Slide 5: Code Example - BOUNDARY

```typescript
// routes/opportunities.ts

router.post('/', 
  authenticate,                    // Middleware
  authorize(['PIN']),              // Middleware
  validateRequest(createRules),    // Validation
  RequestController.createRequest  // → Controller
);
```

**Job:** Define endpoints, apply middleware, route to controller

---

## Slide 6: Code Example - CONTROL

```typescript
// controllers/request.controller.ts

static async createRequest(req, res) {
  const { categoryId, title, urgency } = req.body;
  const pinId = req.user.pinId;
  
  // 🧠 Business logic
  const request = await prisma.request.create({
    data: {
      pinId,
      categoryId,
      title,
      urgency,
      status: 'ACTIVE'
    }
  });
  
  res.status(201).json({ request });
}
```

**Job:** Validate, process, coordinate

---

## Slide 7: Code Example - ENTITY

```prisma
// prisma/schema.prisma

model Request {
  id          String        @id @default(uuid())
  pinId       String
  title       String
  urgency     UrgencyLevel
  status      RequestStatus @default(ACTIVE)
  
  pin         PIN           @relation(...)
  category    ServiceCategory @relation(...)
  offers      VolunteerOffer[]
}
```

**Job:** Define data structure & relationships

---

## Slide 8: Why Use BCE?

### ✅ Benefits

| Benefit | Impact |
|---------|--------|
| **Clean Code** | Easy to read & understand |
| **Easy Debugging** | Know exactly where to look |
| **Team Collaboration** | Work without conflicts |
| **Flexibility** | Change one layer safely |
| **Testability** | Test each part independently |

---

## Slide 9: Real Team Workflow

```
Developer 1 → ENTITY
└── Designs database models
    (schema.prisma)

Developer 2 → CONTROL
└── Writes business logic
    (controllers/)

Developer 3 → BOUNDARY
└── Creates API endpoints
    (routes/)

✨ No conflicts! Everyone has their zone!
```

---

## Slide 10: Adding a New Feature

```
STEP 1: ENTITY
└── Define what data you need
    
STEP 2: CONTROL
└── Write the business logic
    
STEP 3: BOUNDARY
└── Expose it as an API endpoint

Always: Entity → Control → Boundary
```

---

## Slide 11: Quick Reference

```
╔════════════════════════════════════════╗
║  Need to...                Where?     ║
╠════════════════════════════════════════╣
║  Add API endpoint          routes/    ║
║  Add validation            control    ║
║  Change business logic     control    ║
║  Add database field        entity     ║
║  Change data structure     entity     ║
╚════════════════════════════════════════╝
```

---

## Slide 12: Common Questions

**Q: Isn't this overengineering?**  
A: For 5+ people, it prevents chaos!

**Q: What if I need to change databases?**  
A: Only change Entity layer, rest stays same!

**Q: Where do I start when debugging?**  
A: 
- API not responding? → Boundary
- Wrong data returned? → Control  
- Database error? → Entity

---

## Slide 13: The Flow (One More Time!)

```
    USER
     ↓
  BOUNDARY ──→ "What endpoint?"
     ↓
  CONTROL  ──→ "What rules?"
     ↓
   ENTITY  ──→ "What data?"
     ↓
  DATABASE
```

**Data flows down, response flows back up!**

---

## Slide 14: Your Turn!

### Exercise: Trace a Request

**Scenario:** PIN creates a new help request

1. Which file handles the endpoint? 
   - `routes/opportunities.ts`

2. Which controller processes it?
   - `RequestController.createRequest`

3. Which model stores it?
   - `Request` model in `schema.prisma`

---

## Slide 15: Key Takeaway

```
┌────────────────────────────────────┐
│                                    │
│    BCE = Organized Code            │
│                                    │
│    Organized Code = Happy Team     │
│                                    │
│    Happy Team = Successful Project │
│                                    │
└────────────────────────────────────┘
```

> **"Each layer does ONE thing well,  
> and the whole system works beautifully!"**

---

## Slide 16: Resources

📚 **Documentation:**
- `BCE_SIMPLE_GUIDE.md` - Quick reference
- `BCE_ARCHITECTURE.md` - Deep dive
- `API_DOCUMENTATION.md` - All endpoints
- `START_STOP_GUIDE.md` - Run the project

💬 **Questions?**
- Check the docs first
- Ask the team
- Review working examples in code

---

## Slide 17: Remember

```
    🚪 BOUNDARY  →  WHERE?  →  routes/
    
    🧠 CONTROL   →  HOW?    →  controllers/
    
    💾 ENTITY    →  WHAT?   →  prisma/
```

**That's it! You now understand BCE! 🎉**

---

**Thank you!**

*Made with 💙 for CSIT314 Project*

---

## 📌 Presenter Notes

### Slide Timing (15 min presentation):
- Slides 1-3: 3 min (Introduction & analogy)
- Slides 4-7: 5 min (Structure & code examples)
- Slides 8-10: 3 min (Benefits & workflow)
- Slides 11-13: 2 min (Reference & recap)
- Slides 14-17: 2 min (Exercise & closing)

### Key Points to Emphasize:
1. **Restaurant analogy** - Most relatable
2. **Real code examples** - Show it in action
3. **Team benefits** - Why it matters for collaboration
4. **Simple flow** - Request → Boundary → Control → Entity

### Demo Tips:
- Open VS Code and show the folder structure
- Walk through one complete flow (login is best)
- Show how middleware fits in
- Demonstrate where to look when debugging

### Common Questions & Answers:
- "Too complex?" → Actually makes it simpler!
- "More files?" → But each file is smaller and focused
- "Worth it?" → Ask any team that scaled without it!

