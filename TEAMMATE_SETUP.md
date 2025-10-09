# 🚀 Teammate Setup Guide - CSR Volunteer Matching System

Welcome to the team! This guide will get you up and running in about 20 minutes.

---

## 📋 **Prerequisites Checklist**

Before starting, make sure you have:

- [ ] **Mac computer** (you have this ✅)
- [ ] **Cursor IDE** (you have this ✅)
- [ ] **GitHub account** with access to the repository
- [ ] **Git installed** (check: `git --version`)
- [ ] **Node.js v18+** (check: `node --version`)
- [ ] **npm** (check: `npm --version`)
- [ ] **Docker Desktop** (we'll install this)

---

## 🎯 **Quick Setup (20 minutes)**

### **Step 1: Install Docker Desktop** (5 minutes)

Docker is needed to run the PostgreSQL database.

1. **Download Docker Desktop for Mac:**
   - Go to: https://www.docker.com/products/docker-desktop
   - Download for **Mac with Apple Silicon** or **Mac with Intel Chip**
   - Install by dragging to Applications folder

2. **Open Docker Desktop:**
   - Open from Applications folder
   - Accept terms and conditions
   - Wait for Docker to start (whale icon in menu bar)

3. **Verify Docker is running:**
   ```bash
   docker --version
   # Should show: Docker version 24.x.x or higher
   
   docker compose version
   # Should show: Docker Compose version v2.x.x or higher
   ```

---

### **Step 2: Clone the Repository** (2 minutes)

```bash
# 1. Navigate to where you want the project
cd ~/Documents  # or wherever you keep projects

# 2. Clone the repository
git clone https://github.com/MatthewGohyy/CSR-Volunteer-Matching-System.git

# 3. Enter the project directory
cd CSR-Volunteer-Matching-System

# 4. Verify you're in the right place
ls
# You should see: client/ server/ docker-compose.yml README.md etc.
```

---

### **Step 3: Install Dependencies** (3 minutes)

#### **Backend Dependencies:**
```bash
cd server
npm install
cd ..
```

#### **Frontend Dependencies:**
```bash
cd client
npm install
cd ..
```

---

### **Step 4: Setup Environment Variables** (1 minute)

Create the backend `.env` file:

```bash
cd server
cat > .env << 'EOF'
DATABASE_URL="postgresql://dev:dev123@localhost:5432/csr_platform"
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173
EOF
cd ..
```

Or manually create `server/.env` with:
```env
DATABASE_URL="postgresql://dev:dev123@localhost:5432/csr_platform"
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173
```

---

### **Step 5: Start Docker & Database** (5 minutes)

```bash
# Make sure Docker Desktop is running (check menu bar)

# Start PostgreSQL and pgAdmin
docker compose up -d

# Wait 10 seconds for database to start
sleep 10

# Check containers are running
docker compose ps
# Should show 2 containers: csr-platform-db and csr-platform-pgadmin
```

---

### **Step 6: Setup Database** (3 minutes)

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run database migrations (creates tables)
npx prisma migrate dev --name init

# Seed database with initial data
npm run seed

cd ..
```

You should see:
```
✅ Generated Prisma Client
✅ Database migrations applied
✅ Seed complete
```

---

### **Step 7: Start the Application** (1 minute)

#### **Terminal 1: Start Backend**
```bash
cd server
npm run dev
```

You should see:
```
✅ Database connected
🚀 Server running on http://localhost:4000
📊 pgAdmin available at http://localhost:5050
```

#### **Terminal 2: Start Frontend** (in a new terminal)
```bash
cd client
PORT=3001 npm start
```

You should see:
```
Compiled successfully!
Local: http://localhost:3001
```

---

### **Step 8: Verify Everything Works** ✅

#### **Test Backend:**
Open browser and go to:
```
http://localhost:4000/health
```

Should show:
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "connected",
  "environment": "development"
}
```

#### **Test Frontend:**
Open browser and go to:
```
http://localhost:3001
```

Should show the CSR Volunteer Match landing page with a beautiful UI.

#### **Test Database:**
Open browser and go to:
```
http://localhost:5050
```

Login with:
- Email: `admin@csr.com`
- Password: `admin123`

---

## 🎉 **You're All Set!**

Your development environment is now identical to your teammate's!

---

## 📂 **Project Structure Overview**

```
CSR-Volunteer-Matching-System/
├── client/                 # React Frontend (Port 3001)
│   ├── src/
│   │   ├── config/        # API configuration
│   │   ├── services/      # API service files
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app component
│   └── package.json
│
├── server/                # Express Backend (Port 4000)
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Seed data
│   ├── src/
│   │   ├── controllers/   # API logic
│   │   ├── middleware/    # Auth, validation
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Helper functions
│   │   └── server.ts      # Main server file
│   └── package.json
│
├── docker-compose.yml     # Docker configuration
├── README.md             # Project overview
├── GITHUB_WORKFLOW.md    # Git workflow guide
└── git-helper.sh         # Git helper script
```

---

## 🔧 **Daily Development Workflow**

### **Morning Routine:**
```bash
# 1. Pull latest changes
git checkout main
git pull origin main

# 2. Make sure Docker is running
docker compose ps

# 3. Create a new branch for your task
git checkout -b feature/your-task-name

# 4. Start backend (Terminal 1)
cd server && npm run dev

# 5. Start frontend (Terminal 2)
cd client && PORT=3001 npm start
```

### **During Development:**
- Make your changes
- Test as you go
- Commit frequently:
  ```bash
  git add .
  git commit -m "feat: what you did"
  ```

### **End of Day:**
```bash
# Push your work
git push -u origin feature/your-task-name

# Create Pull Request on GitHub
# Request review from teammate
```

---

## 🛠️ **Useful Commands**

### **Backend:**
```bash
cd server

# Start development server
npm run dev

# View database in browser UI
npx prisma studio  # Opens http://localhost:5555

# Reset database (careful!)
npx prisma migrate reset
```

### **Frontend:**
```bash
cd client

# Start development server
PORT=3001 npm start

# Build for production
npm run build
```

### **Docker:**
```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# View logs
docker compose logs -f

# Restart containers
docker compose restart
```

### **Git:**
```bash
# Check status
git status

# Create branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "feat: description"

# Push to GitHub
git push -u origin feature/my-feature

# Pull latest
git pull origin main

# Use helper script (easier!)
./git-helper.sh
```

---

## 🧪 **Test the Full System**

Run the automated test workflow:
```bash
./test-workflow.sh
```

This tests:
- ✅ User registration (PIN & CSR Rep)
- ✅ Creating requests
- ✅ Submitting offers
- ✅ Accepting offers (matching)
- ✅ Completing matches

---

## 📚 **Important Documentation**

Must-read files in the project:

1. **[README.md](README.md)** - Project overview & quick start
2. **[GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md)** - Complete Git workflow
3. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - All API endpoints
4. **[DATABASE.md](DATABASE.md)** - Database schema
5. **[FRONTEND_BACKEND_CONNECTED.md](FRONTEND_BACKEND_CONNECTED.md)** - Integration guide
6. **[client/INTEGRATION.md](client/INTEGRATION.md)** - Frontend API usage

---

## 🔐 **Test Credentials**

### **Admin Account:**
```
Email: admin@csr.com
Password: admin123
```

### **pgAdmin (Database UI):**
```
URL: http://localhost:5050
Email: admin@csr.com
Password: admin123
```

---

## 🎯 **Your First Task**

After setup, try this to get familiar:

1. **Explore the API:**
   ```bash
   # Login as admin
   curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@csr.com","password":"admin123"}'
   ```

2. **Open Prisma Studio:**
   ```bash
   cd server
   npx prisma studio
   ```
   Browse the database tables and see the seed data.

3. **Create a test branch:**
   ```bash
   git checkout -b feature/test-setup
   git push -u origin feature/test-setup
   ```

4. **Review existing code:**
   - Open Cursor IDE
   - Browse `server/src/routes/` to see API endpoints
   - Browse `client/src/services/` to see frontend services

---

## 🚨 **Troubleshooting**

### **Backend won't start - Port already in use:**
```bash
# Check what's using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=4001 npm run dev
```

### **Frontend won't start - Port in use:**
```bash
# Start on different port
PORT=3002 npm start
```

### **Docker containers won't start:**
```bash
# Stop all containers
docker compose down

# Remove volumes (resets database)
docker compose down -v

# Start fresh
docker compose up -d
```

### **Database connection error:**
```bash
# Check containers are running
docker compose ps

# Restart PostgreSQL
docker compose restart postgres

# Check logs
docker compose logs postgres
```

### **Missing dependencies:**
```bash
# Reinstall backend
cd server
rm -rf node_modules package-lock.json
npm install

# Reinstall frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

### **Prisma errors:**
```bash
cd server

# Regenerate Prisma client
npx prisma generate

# Reset database
npx prisma migrate reset
```

---

## 💡 **Pro Tips**

1. **Use git-helper.sh:**
   ```bash
   ./git-helper.sh
   ```
   Interactive menu for all git operations!

2. **Keep Docker Desktop running:**
   Start it when you boot your Mac, it runs in background.

3. **Pull before starting work:**
   ```bash
   git checkout main
   git pull origin main
   ```

4. **Commit often:**
   Small, frequent commits are better than one big commit.

5. **Test before pushing:**
   Make sure everything works before pushing to GitHub.

6. **Use meaningful branch names:**
   - ✅ `feature/user-login`
   - ✅ `fix/api-timeout`
   - ❌ `test`
   - ❌ `stuff`

7. **Ask questions:**
   If stuck, ask your teammate! Better to ask than guess.

---

## 🆘 **Getting Help**

### **If something doesn't work:**

1. **Check documentation:**
   - README.md
   - GITHUB_WORKFLOW.md
   - SETUP.md

2. **Ask your teammate:**
   - Share your screen
   - Explain what you tried
   - Show error messages

3. **Check logs:**
   ```bash
   # Backend logs
   cat /tmp/backend.log
   
   # Frontend logs (in terminal)
   
   # Docker logs
   docker compose logs
   ```

4. **Google the error:**
   Copy error message and search on:
   - Stack Overflow
   - GitHub Issues
   - Documentation

---

## ✅ **Setup Verification Checklist**

Go through this to confirm everything works:

- [ ] Docker Desktop installed and running
- [ ] Repository cloned
- [ ] Backend dependencies installed (`cd server && npm install`)
- [ ] Frontend dependencies installed (`cd client && npm install`)
- [ ] `.env` file created in `server/`
- [ ] Docker containers running (`docker compose ps`)
- [ ] Database migrated (`npx prisma migrate dev`)
- [ ] Database seeded (`npm run seed`)
- [ ] Backend starts (`cd server && npm run dev`)
- [ ] Frontend starts (`cd client && PORT=3001 npm start`)
- [ ] Health endpoint works (http://localhost:4000/health)
- [ ] Frontend loads (http://localhost:3001)
- [ ] pgAdmin accessible (http://localhost:5050)
- [ ] Can create git branch (`git checkout -b test`)
- [ ] Can push to GitHub (`git push`)

---

## 🎉 **Welcome to the Team!**

You now have:
- ✅ Complete development environment
- ✅ All dependencies installed
- ✅ Database running
- ✅ Backend API running (Port 4000)
- ✅ Frontend running (Port 3001)
- ✅ Git workflow tools
- ✅ Access to all documentation

**You're ready to start coding! 🚀**

**Questions? Ask your teammate!**

---

## 📞 **Quick Reference**

**Services:**
- Frontend: http://localhost:3001
- Backend: http://localhost:4000
- pgAdmin: http://localhost:5050
- Prisma Studio: `npx prisma studio` → http://localhost:5555

**Credentials:**
- Admin: admin@csr.com / admin123
- pgAdmin: admin@csr.com / admin123

**Commands:**
```bash
# Start everything
docker compose up -d
cd server && npm run dev     # Terminal 1
cd client && PORT=3001 npm start  # Terminal 2

# Git workflow
./git-helper.sh

# Database UI
cd server && npx prisma studio
```

**First branch:**
```bash
git checkout main
git pull origin main
git checkout -b feature/my-first-task
# Code...
git add .
git commit -m "feat: my first change"
git push -u origin feature/my-first-task
# Create PR on GitHub
```

---

**Happy coding! 🎉**
