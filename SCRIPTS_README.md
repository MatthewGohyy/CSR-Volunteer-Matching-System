# 🔧 Helper Scripts Guide

**Automation scripts to make your life easier!**

---

## 📜 Available Scripts (3 Essential Tools)

### **1. `git-helper.sh` - Git Workflow Helper** 🌳
**Purpose:** Interactive git operations for daily development

**Usage:**
```bash
./git-helper.sh
```

**Features:**
- ✅ Create new branches
- ✅ Commit changes with proper messages
- ✅ Push to GitHub
- ✅ Pull latest changes
- ✅ Check status
- ✅ Complete workflow (commit + push)


**When to use:**
- Every day for all git operations
- Instead of typing git commands manually
- Beginner-friendly with interactive menu

**Example:**
```bash
./git-helper.sh
# Choose option 1: Create new branch
# Enter: feature/user-login
# Start coding...
# Run again for commit & push
```

---

### **2. `setup-db.sh` - Database Setup** 💾
**Purpose:** Automated PostgreSQL + Prisma setup

**Usage:**
```bash
chmod +x setup-db.sh  # First time only
./setup-db.sh
```

**What it does:**
- ✅ Starts Docker containers
- ✅ Installs npm dependencies
- ✅ Generates Prisma client
- ✅ Runs database migrations
- ✅ Seeds initial data

**When to use:**
- First time setting up the project
- After pulling major database changes
- When resetting database

---

### **3. `test-workflow.sh` - API Testing** 🧪
**Purpose:** Test complete user flow from registration to match

**Usage:**
```bash
./test-workflow.sh
```

**What it tests:**
- ✅ PIN registration
- ✅ CSR Rep registration
- ✅ Request creation
- ✅ Shortlisting
- ✅ Volunteer offers
- ✅ Match acceptance
- ✅ Match completion

**When to use:**
- After making API changes
- To verify everything works
- Before creating Pull Request
- When teammate wants to test your code

---

## 🚀 Quick Start for New Developers

### **First Time Setup:**
```bash
# 1. Setup database
./setup-db.sh

# 2. Test everything works
./test-workflow.sh
```

### **Daily Development:**
```bash
# Morning: Pull latest changes
./git-helper.sh
# Choose option 5 (Pull latest)

# Work on your feature...

# Evening: Commit and push
./git-helper.sh
# Choose option 6 (Complete workflow)
```

---

## 📋 Common Scenarios

### **Scenario 1: Starting a new feature**
```bash
./git-helper.sh
# Option 1: Create branch → feature/my-feature
# Code your feature...
# Option 2: Commit → "feat: my feature"
# Option 3: Push to GitHub
```

### **Scenario 2: Database issues**
```bash
# Reset and setup database
docker compose down -v
./setup-db.sh
```

### **Scenario 3: Verify API works**
```bash
# Run automated tests
./test-workflow.sh

# Should see all ✅ checkmarks
```

### **Scenario 4: Before creating PR**
```bash
# 1. Test your changes
./test-workflow.sh

# 2. Commit and push
./git-helper.sh
# Option 6: Complete workflow

# 3. Create PR on GitHub
```

---

## 💡 Pro Tips

### **Git Helper Best Practices:**
1. **Use it daily** - Easier than remembering git commands
2. **Descriptive commits** - Follow the prompts for good messages
3. **Pull often** - Use option 5 to get teammate's changes

### **Testing:**
1. **Run before PR** - Verify your changes work
2. **Run after pull** - Make sure everything still works
3. **Share results** - Screenshot test output for teammate

### **Database:**
1. **Setup once** - Only run setup-db.sh when needed
2. **Don't reset often** - You'll lose data
3. **Use Prisma Studio** - `npx prisma studio` for data viewing

---

## 🔍 Script Details

| Script | Lines | Purpose | Frequency |
|--------|-------|---------|-----------|
| git-helper.sh | 268 | Git operations | Daily ⭐ |
| setup-db.sh | 101 | Database setup | Once/rarely |
| test-workflow.sh | 176 | API testing | Before PR |

---

## ❓ FAQ

### **Q: Do I need to make scripts executable?**
A: They're already executable! Just run them with `./script-name.sh`

### **Q: Can my teammate use these?**
A: YES! All scripts work for everyone. They're version controlled in Git.

### **Q: What if a script fails?**
A: Check the error message. Common fixes:
- Docker not running → Start Docker Desktop
- Port in use → Kill the process
- Permission denied → Run `chmod +x script-name.sh`

### **Q: Can I modify the scripts?**
A: Yes! They're just bash scripts. Improve them and share with team.

---

## 🎯 Summary

**3 Essential Scripts:**
1. **git-helper.sh** - Use daily for git ⭐
2. **setup-db.sh** - Use for database setup
3. **test-workflow.sh** - Use before PR

**Everything is team-friendly and ready to use!** 🎉

---

**Questions? Check [TEAMMATE_SETUP.md](TEAMMATE_SETUP.md) or [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md)**

