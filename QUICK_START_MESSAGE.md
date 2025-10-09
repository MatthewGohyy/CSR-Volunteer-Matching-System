# 👋 Quick Start for Teammate

Hey! Here's how to set up the project on your Mac with Cursor.

## 🚀 **One-Command Setup** (20 minutes total)

### **Step 1: Install Docker Desktop** (5 min)
Download and install: https://www.docker.com/products/docker-desktop

### **Step 2: Clone & Setup** (15 min)
Copy and paste these commands into your terminal:

```bash
# Clone repository
cd ~/Documents
git clone https://github.com/MatthewGohyy/CSR-Volunteer-Matching-System.git
cd CSR-Volunteer-Matching-System

# Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..

# Create environment file
cat > server/.env << 'EOF'
DATABASE_URL="postgresql://dev:dev123@localhost:5432/csr_platform"
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173
EOF

# Start Docker & Database
docker compose up -d
sleep 10

# Setup database
cd server
npx prisma generate
npx prisma migrate dev --name init
npm run seed
cd ..
```

### **Step 3: Start Everything**

**Terminal 1 (Backend):**
```bash
cd server && npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client && PORT=3001 npm start
```

### **Step 4: Verify**
Open in browser:
- Frontend: http://localhost:3001 ✅
- Backend: http://localhost:4000/health ✅
- Database UI: http://localhost:5050 (login: admin@csr.com / admin123) ✅

---

## 📚 **Complete Guide**

For detailed setup instructions, see: **[TEAMMATE_SETUP.md](TEAMMATE_SETUP.md)**

---

## 🔗 **Quick Links**

- **Repository:** https://github.com/MatthewGohyy/CSR-Volunteer-Matching-System
- **Pull Request I created:** [Check GitHub PRs](https://github.com/MatthewGohyy/CSR-Volunteer-Matching-System/pulls)
- **Documentation:** All `.md` files in the project root

---

## 💬 **After Setup**

1. Review the current Pull Request I created
2. Test the code locally
3. Leave comments/feedback
4. Approve when ready

---

**Questions? Just ask! 🙌**
