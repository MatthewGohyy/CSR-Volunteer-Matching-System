# 🎮 Start & Stop Guide

**Quick reference for starting and stopping all services.**

---

## 🚀 **START Everything**

### **Method 1: Individual Terminals (Recommended)**

**Terminal 1: Backend**
```bash
cd server
npm run dev
```

**Terminal 2: Frontend**
```bash
cd client
npm start
```

**Terminal 3: Database (if not running)**
```bash
docker compose up -d
```

---

### **Method 2: Background Mode**

```bash
# Start database
docker compose up -d

# Start backend in background
cd server && npm run dev > /tmp/backend.log 2>&1 &

# Start frontend in background
cd client && npm start > /tmp/frontend.log 2>&1 &

# View logs
tail -f /tmp/backend.log   # Backend logs
tail -f /tmp/frontend.log  # Frontend logs
```

---

## 🛑 **STOP Everything**

### **Method 1: If Running in Terminals**

**Just press:**
```
Ctrl + C (in each terminal window)
```

---

### **Method 2: If Running in Background**

**Stop Backend:**
```bash
pkill -f nodemon
```

**Stop Frontend:**
```bash
pkill -f "react-scripts"
```

**Stop Docker Containers:**
```bash
docker compose down
```

**Stop Everything at Once:**
```bash
# Nuclear option - stops all Node processes
pkill node

# Then stop Docker
docker compose down
```

---

### **Method 3: Using PIDs** (Precise Control)

**Find Process IDs:**
```bash
# Find backend
ps aux | grep nodemon

# Find frontend
ps aux | grep react-scripts
```

**Kill Specific Process:**
```bash
kill -9 <PID>
```

---

## 🔄 **RESTART Services**

### **Restart Backend:**
```bash
# Stop
pkill -f nodemon

# Start
cd server && npm run dev
```

### **Restart Frontend:**
```bash
# Stop
pkill -f "react-scripts"

# Start
cd client && npm start
```

### **Restart Docker:**
```bash
docker compose restart

# Or full restart
docker compose down
docker compose up -d
```

---

## 📊 **Check What's Running**

### **Check Backend:**
```bash
ps aux | grep nodemon
# Or
curl http://localhost:4000/health
```

### **Check Frontend:**
```bash
ps aux | grep react-scripts
# Or
curl http://localhost:3000
```

### **Check Docker:**
```bash
docker compose ps
```

### **Check All at Once:**
```bash
echo "=== Backend ===" && \
curl -s http://localhost:4000/health 2>&1 | head -1 && \
echo "" && \
echo "=== Frontend ===" && \
curl -s http://localhost:3000 2>&1 | head -1 && \
echo "" && \
echo "=== Docker ===" && \
docker compose ps
```

---

## 🎯 **Common Scenarios**

### **End of Day (Stop Everything):**
```bash
# Stop backend
pkill -f nodemon

# Stop frontend
pkill -f "react-scripts"

# Keep Docker running (recommended)
# Or stop Docker:
docker compose down
```

### **Start Next Day:**
```bash
# Check/start Docker
docker compose ps
docker compose up -d  # if not running

# Start backend
cd server && npm run dev

# Start frontend (new terminal)
cd client && npm start
```

### **Quick Restart (Code Changes Not Reflecting):**
```bash
# Backend auto-restarts with nodemon, but if stuck:
pkill -f nodemon && cd server && npm run dev

# Frontend auto-reloads, but if stuck:
pkill -f "react-scripts" && cd client && npm start
```

---

## 🚨 **Troubleshooting**

### **Port Already in Use:**
```bash
# Find what's using the port
lsof -i :4000   # Backend
lsof -i :3000   # Frontend

# Kill it
lsof -ti :4000 | xargs kill -9
lsof -ti :3000 | xargs kill -9
```

### **Process Won't Stop:**
```bash
# Find the process
ps aux | grep nodemon

# Force kill
kill -9 <PID>
```

### **Can't Find Running Process:**
```bash
# List all Node processes
ps aux | grep node

# Kill all (use with caution)
pkill node
```

---

## ⚡ **Quick Commands Cheat Sheet**

```bash
# START
docker compose up -d              # Database
cd server && npm run dev          # Backend
cd client && npm start            # Frontend

# STOP
Ctrl+C                            # If in terminal
pkill -f nodemon                  # Backend
pkill -f "react-scripts"          # Frontend
docker compose down               # Docker

# CHECK
curl http://localhost:4000/health # Backend
curl http://localhost:3000        # Frontend
docker compose ps                 # Docker

# RESTART
docker compose restart            # Docker
# For backend/frontend: stop then start
```

---

## 💡 **Best Practices**

1. **Development Mode:**
   - Keep Docker running (uses minimal resources)
   - Stop backend/frontend when not coding
   - Restart when you come back

2. **End of Day:**
   - Stop backend & frontend (saves battery)
   - Keep Docker running OR stop with `docker compose down`

3. **Switching Branches:**
   - Stop backend (may have code changes)
   - Keep frontend running if no changes
   - Restart after switching

4. **Before Pull Request:**
   - Make sure everything is running
   - Test all features work
   - Then stop and commit

---

**Quick access: Bookmark this file for daily use!** 🔖

