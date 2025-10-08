# 🚀 Quick Start Guide - PostgreSQL + Prisma

## One-Command Setup

```bash
./setup-db.sh && cd server && npm run dev
```

That's it! 🎉

---

## Manual Steps (If Needed)

### 1️⃣ Start Database
```bash
docker-compose up -d
```

### 2️⃣ Install & Setup
```bash
cd server
npm install
cp .env.example .env
```

### 3️⃣ Initialize Database
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

### 4️⃣ Start Server
```bash
npm run dev
```

---

## 🔗 Access Links

| Service | URL | Credentials |
|---------|-----|-------------|
| Backend API | http://localhost:3000 | - |
| Health Check | http://localhost:3000/health | - |
| DB Test | http://localhost:3000/api/test-db | - |
| pgAdmin | http://localhost:5050 | admin@csr.com / admin123 |
| Prisma Studio | `npx prisma studio` | - |

---

## 🧪 Test Accounts

| Type | Email | Password |
|------|-------|----------|
| Admin | admin@csr.com | admin123 |

---

## 💡 Common Commands

### Database
```bash
# Start/Stop
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose down -v        # Stop + delete all data

# Prisma
npx prisma studio             # Database GUI
npx prisma generate           # Regenerate client
npx prisma migrate dev        # New migration
npx prisma migrate reset      # Reset DB (dev only)
npm run seed                  # Seed database
```

### Development
```bash
npm run dev                   # Start dev server
npm run build                 # Build for production
npm run type-check            # TypeScript check
npm run lint                  # Lint code
```

---

## 🐛 Troubleshooting

### Port Conflicts
```bash
# Check ports
lsof -i :3000                 # Backend
lsof -i :5432                 # PostgreSQL
lsof -i :5050                 # pgAdmin

# Or change ports in docker-compose.yml
```

### Database Issues
```bash
# Check Docker
docker ps

# Restart DB
docker-compose restart postgres

# View logs
docker-compose logs -f postgres

# Nuclear option (DELETES ALL DATA!)
docker-compose down -v
docker-compose up -d
cd server
npx prisma migrate dev
npm run seed
```

### Prisma Issues
```bash
# Client out of sync
npx prisma generate

# Migration conflicts
npx prisma migrate reset

# Can't connect to DB
# 1. Check if Docker is running
# 2. Check .env DATABASE_URL
# 3. Restart containers
```

---

## 📋 Database Schema Summary

### Core Models
- **User** - Authentication (email, password, userType)
- **PIN** - Person In Need profile
- **CSRRep** - CSR Representative profile

### Service Models
- **ServiceCategory** - Service categories
- **Request** - Help requests from PINs
- **Shortlist** - Saved requests by CSR reps
- **VolunteerOffer** - Offers to help
- **Match** - Confirmed matches
- **Notification** - User notifications

### Enums
- UserType: `PIN`, `CSR_REP`, `ADMIN`
- UserStatus: `ACTIVE`, `PENDING`, `SUSPENDED`, `DEACTIVATED`
- RequestStatus: `ACTIVE`, `MATCHED`, `COMPLETED`, `CANCELLED`
- UrgencyLevel: `LOW`, `MEDIUM`, `HIGH`
- OfferStatus: `PENDING`, `ACCEPTED`, `DECLINED`
- MatchStatus: `ACTIVE`, `COMPLETED`, `CANCELLED`

---

## 🎯 Next Steps

1. ✅ Setup complete? Test with: `curl http://localhost:3000/health`
2. 📊 Explore database: `npx prisma studio`
3. 🔧 Start building features
4. 📚 Read [DATABASE.md](DATABASE.md) for detailed schema
5. 📖 Check [SETUP.md](SETUP.md) for advanced setup

---

## 🆘 Get Help

- Check [SETUP.md](SETUP.md) for detailed instructions
- Read [DATABASE.md](DATABASE.md) for schema details
- View Docker logs: `docker-compose logs -f`
- Open an issue on GitHub

---

**Happy Coding! 🚀**

