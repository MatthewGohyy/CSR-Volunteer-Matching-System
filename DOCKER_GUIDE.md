# 🐳 Docker Setup Guide for Beginners

## What is Docker?

Docker is a tool that lets you run applications in "containers" - think of them as lightweight virtual machines. For our project, we use Docker to run PostgreSQL database and pgAdmin (a database management tool) without installing them directly on your computer.

---

## Step 1: Install Docker Desktop

### For macOS (your system):

1. **Download Docker Desktop:**
   - Go to: https://www.docker.com/products/docker-desktop
   - Click "Download for Mac"
   - Choose the right version:
     - **Apple Silicon (M1/M2/M3)**: Download "Mac with Apple chip"
     - **Intel Mac**: Download "Mac with Intel chip"

2. **Install Docker Desktop:**
   - Open the downloaded `.dmg` file
   - Drag Docker icon to Applications folder
   - Open Docker from Applications
   - Follow the setup wizard

3. **Grant Permissions:**
   - Docker may ask for your password to install components
   - Allow any system permission requests

4. **Wait for Docker to Start:**
   - You'll see a Docker icon in your menu bar (top right)
   - When it says "Docker Desktop is running", you're ready!

---

## Step 2: Verify Docker is Running

Open Terminal and run:

```bash
docker --version
```

You should see something like:
```
Docker version 24.0.x, build xxxxx
```

Also check:
```bash
docker compose version
```

You should see:
```
Docker Compose version v2.x.x
```

✅ If both commands work, Docker is installed correctly!

---

## Step 3: Start Your Database

### Option A: Using the Terminal

1. **Navigate to your project:**
   ```bash
   cd /Users/muhammadsalmaanahmednusrath/Library/CloudStorage/OneDrive-UniversityofWollongong/Uni/CSIT314/Project/CSR-Volunteer-Matching-System
   ```

2. **Start Docker containers:**
   ```bash
   docker compose up -d
   ```

   **What this does:**
   - `docker compose`: Uses Docker Compose to manage multiple containers
   - `up`: Starts the containers
   - `-d`: Runs in "detached" mode (in the background)

3. **You should see:**
   ```
   [+] Running 3/3
   ✔ Network csr-volunteer-matching-system_default    Created
   ✔ Container csr-platform-db                        Started
   ✔ Container csr-platform-pgadmin                   Started
   ```

### Option B: Using Docker Desktop GUI

1. Open Docker Desktop application
2. Click "Images" in the left sidebar
3. Find your project's containers
4. Click the play button ▶️ to start them

---

## Step 4: Verify Containers are Running

### Method 1: Terminal
```bash
docker compose ps
```

You should see:
```
NAME                    STATUS          PORTS
csr-platform-db         Up 10 seconds   0.0.0.0:5432->5432/tcp
csr-platform-pgadmin    Up 10 seconds   0.0.0.0:5050->80/tcp
```

### Method 2: Docker Desktop GUI
1. Open Docker Desktop
2. Click "Containers" in the left sidebar
3. You should see two running containers:
   - `csr-platform-db` (PostgreSQL)
   - `csr-platform-pgadmin` (pgAdmin)
   - Both should have a green "Running" status

---

## Step 5: Access Your Services

Once containers are running:

### PostgreSQL Database
- **Host:** localhost
- **Port:** 5432
- **Database:** csr_platform
- **Username:** dev
- **Password:** dev123

### pgAdmin (Database GUI)
- **URL:** http://localhost:5050
- **Email:** admin@csr.com
- **Password:** admin123

To connect to database in pgAdmin:
1. Open http://localhost:5050
2. Login with admin@csr.com / admin123
3. Right-click "Servers" → "Register" → "Server"
4. **General tab:**
   - Name: CSR Platform DB
5. **Connection tab:**
   - Host: postgres (or host.docker.internal)
   - Port: 5432
   - Database: csr_platform
   - Username: dev
   - Password: dev123
6. Click "Save"

---

## Common Docker Commands

### Starting Containers
```bash
# Start containers in background
docker compose up -d

# Start containers and see logs
docker compose up
```

### Stopping Containers
```bash
# Stop containers (keeps data)
docker compose down

# Stop containers and DELETE all data
docker compose down -v
```

### Viewing Logs
```bash
# View all logs
docker compose logs

# View logs for specific service
docker compose logs postgres

# Follow logs (live updates)
docker compose logs -f
```

### Check Status
```bash
# List running containers
docker compose ps

# List all Docker containers
docker ps -a
```

### Restart Containers
```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart postgres
```

---

## Troubleshooting

### Problem: "docker: command not found"
**Solution:** Docker Desktop is not installed or not in PATH
- Install Docker Desktop from https://docker.com
- Restart your terminal after installation

### Problem: "Cannot connect to the Docker daemon"
**Solution:** Docker Desktop is not running
- Open Docker Desktop application
- Wait for it to fully start (Docker icon in menu bar)
- Try the command again

### Problem: "port is already allocated"
**Solution:** Another application is using the port
```bash
# Check what's using port 5432
lsof -i :5432

# Kill the process (replace PID with actual number)
kill -9 <PID>

# Or change the port in docker-compose.yml
# Change "5432:5432" to "5433:5432"
# Then update DATABASE_URL in .env to use port 5433
```

### Problem: Containers keep stopping
**Solution:** Check the logs
```bash
docker compose logs postgres
```

Common issues:
- Port conflict (change port in docker-compose.yml)
- Insufficient memory (increase Docker memory in Docker Desktop settings)
- Corrupted data (run `docker compose down -v` then `docker compose up -d`)

### Problem: "Cannot find docker-compose.yml"
**Solution:** You're in the wrong directory
```bash
# Make sure you're in the project root
cd /Users/muhammadsalmaanahmednusrath/Library/CloudStorage/OneDrive-UniversityofWollongong/Uni/CSIT314/Project/CSR-Volunteer-Matching-System

# Then run docker compose commands
docker compose up -d
```

---

## Docker Desktop Settings (Optional)

### Increase Resources (if needed):
1. Open Docker Desktop
2. Click ⚙️ Settings
3. Go to "Resources"
4. Adjust:
   - **CPUs:** 2-4 cores
   - **Memory:** 2-4 GB
   - **Disk:** 20-40 GB
5. Click "Apply & Restart"

---

## Complete Setup Workflow

Here's the complete process from start to finish:

### 1. First Time Setup
```bash
# Navigate to project
cd /Users/muhammadsalmaanahmednusrath/Library/CloudStorage/OneDrive-UniversityofWollongong/Uni/CSIT314/Project/CSR-Volunteer-Matching-System

# Start Docker containers
docker compose up -d

# Wait 10 seconds for database to be ready
sleep 10

# Setup backend
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed

# Start development server
npm run dev
```

### 2. Daily Development
```bash
# Start Docker (if not running)
docker compose up -d

# Start dev server
cd server
npm run dev
```

### 3. Shutdown
```bash
# Stop containers (keeps data)
docker compose down

# Or stop everything and delete data
docker compose down -v
```

---

## Visual Guide

### Docker Desktop Main Screen:
```
┌─────────────────────────────────────┐
│  Docker Desktop                  ⚙️  │
├─────────────────────────────────────┤
│  Containers (2)                      │
│  ✅ csr-platform-db        Running   │
│  ✅ csr-platform-pgadmin   Running   │
│                                      │
│  Images                              │
│  Volumes                             │
│  Settings                            │
└─────────────────────────────────────┘
```

### Container Status:
- 🟢 **Green/Running** = Container is working
- 🔴 **Red/Exited** = Container stopped (check logs)
- 🟡 **Yellow/Starting** = Container is starting

---

## Quick Reference Card

| Action | Command |
|--------|---------|
| Start containers | `docker compose up -d` |
| Stop containers | `docker compose down` |
| View status | `docker compose ps` |
| View logs | `docker compose logs -f` |
| Restart | `docker compose restart` |
| Delete everything | `docker compose down -v` |
| Open pgAdmin | http://localhost:5050 |

---

## Need Help?

1. **Check if Docker is running:**
   - Look for Docker icon in menu bar (🐳)
   - Should say "Docker Desktop is running"

2. **Check container status:**
   ```bash
   docker compose ps
   ```

3. **View error logs:**
   ```bash
   docker compose logs postgres
   ```

4. **Nuclear option (restart everything):**
   ```bash
   docker compose down -v
   docker compose up -d
   cd server
   npx prisma migrate dev
   npm run seed
   ```

---

## What's Next?

Once Docker is running:

1. ✅ Verify database: http://localhost:3000/api/test-db
2. ✅ Open pgAdmin: http://localhost:5050
3. ✅ Run Prisma Studio: `npx prisma studio`
4. ✅ Start dev server: `npm run dev`

**You're all set!** 🎉

