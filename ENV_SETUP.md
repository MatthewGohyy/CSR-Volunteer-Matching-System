# 🔐 Environment Variables Setup

**Quick guide to fix the "Environment variable not found: DATABASE_URL" error.**

---

## 🚨 **Problem**

When running `./setup-db.sh` or any Prisma command, you see:

```
Error: Environment variable not found: DATABASE_URL.
  --> prisma/schema.prisma:7
```

---

## ✅ **Solution: Create the `.env` File**

The `.env` file contains sensitive credentials and is **NOT in Git** (for security), so you need to create it manually.

---

## 📝 **Step-by-Step Instructions**

### **1. Navigate to the server directory:**
```bash
cd server
```

### **2. Create the `.env` file:**
```bash
# Copy from example (or create manually)
cp .env.example .env
```

**OR manually create it:**
```bash
touch .env
```

### **3. Add this EXACT content to `server/.env`:**
```bash
DATABASE_URL="postgresql://dev:dev123@localhost:5432/csr_platform"
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3001
```

### **4. Verify the file exists:**
```bash
ls -la | grep .env
# Should see: .env
```

### **5. Run setup again:**
```bash
cd ..  # Go back to project root
./setup-db.sh
```

---

## 🎯 **Quick One-Liner (From Project Root)**

```bash
cat > server/.env << 'EOF'
DATABASE_URL="postgresql://dev:dev123@localhost:5432/csr_platform"
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3001
EOF
```

Then run:
```bash
./setup-db.sh
```

---

## 📋 **What Each Variable Does**

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | `postgresql://dev:dev123@localhost:5432/csr_platform` | Connects to PostgreSQL database in Docker |
| `JWT_SECRET` | `your_super_secret...` | Encrypts authentication tokens |
| `JWT_EXPIRES_IN` | `7d` | Token expiration (7 days) |
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `4000` | Backend server port |
| `FRONTEND_URL` | `http://localhost:3001` | Frontend URL for CORS |

---

## 🔒 **Security Note**

**NEVER commit `.env` files to Git!**

The `.gitignore` file already excludes `.env` files, but be careful:
- ✅ DO share `.env.example` (template without real credentials)
- ❌ DON'T share `.env` (contains real credentials)
- ✅ DO share this `ENV_SETUP.md` guide with teammates

---

## 🆘 **Still Having Issues?**

### **Issue: "Connection refused" error**
**Solution:** Make sure Docker is running:
```bash
docker compose ps
# If not running:
docker compose up -d
```

### **Issue: "Port 5432 already in use"**
**Solution:** Another PostgreSQL instance is running:
```bash
# On Mac:
brew services stop postgresql

# Or find and kill the process:
lsof -ti :5432 | xargs kill -9
```

### **Issue: Permission denied when creating .env**
**Solution:** Check you're in the right directory:
```bash
pwd
# Should be: .../CSR-Volunteer-Matching-System/server

# If not:
cd server
```

---

## ✨ **Success Indicators**

After creating `.env` and running `./setup-db.sh`, you should see:

```
✅ Docker containers are running
✅ Dependencies installed
✅ Prisma client generated
✅ Running database migrations...
✅ Database seeded successfully
```

---

## 🎉 **You're Done!**

The `.env` file is now set up. You only need to do this **once** per development environment.

**Next steps:**
1. Read [TEAMMATE_SETUP.md](TEAMMATE_SETUP.md) for complete setup guide
2. Run `./test-workflow.sh` to verify everything works
3. Start coding! 🚀

---

**Questions? Check [TEAMMATE_SETUP.md](TEAMMATE_SETUP.md) Section 3: Backend Setup**

