# GitHub Workflow Guide - 2-Person Team

## 📋 **Current Situation**

### ✅ What We Just Built (Uncommitted Changes)

**Modified Files (9):**
- `.gitignore` - Added Docker & Prisma ignores
- `README.md` - Updated with full setup guide
- `server/package.json` - Added Prisma & dependencies
- 5 route files - Implemented full API logic

**New Files (50+):**
- Backend: Controllers, middleware, utilities, Prisma schema
- Frontend: API services, types, configuration
- Documentation: 9 comprehensive markdown files
- Docker: docker-compose.yml, setup scripts
- Database: Prisma migrations & seed data

### 📊 Changes Summary
```
Modified: 9 files (371 additions, 973 deletions)
New: 50+ files (backend, frontend integration, docs)
```

---

## 🌳 **Recommended Git Workflow for 2-Person Team**

### **Strategy: Feature Branch Workflow**

This is perfect for 2 developers and keeps your code organized.

```
main (production-ready code)
  ↓
  ├── feature/backend-setup (you)
  ├── feature/frontend-auth (teammate)
  ├── feature/matching-system (you)
  └── feature/ui-components (teammate)
```

---

## 🚀 **Step-by-Step: Commit Your Current Work**

### **Step 1: Create a Feature Branch**

```bash
# Make sure you're in the project root
cd /Users/muhammadsalmaanahmednusrath/Library/CloudStorage/OneDrive-UniversityofWollongong/Uni/CSIT314/Project/CSR-Volunteer-Matching-System

# Create and switch to a new branch
git checkout -b feature/backend-frontend-integration

# Verify you're on the new branch
git branch
```

### **Step 2: Review Your Changes**

```bash
# See what files changed
git status

# See detailed changes in a file
git diff server/package.json

# See all changes summary
git diff --stat
```

### **Step 3: Stage Your Changes**

**Option A: Add everything (quick)**
```bash
git add .
```

**Option B: Add by category (recommended for review)**
```bash
# Backend setup
git add server/prisma/
git add server/src/
git add server/package*.json

# Frontend integration
git add client/src/config/
git add client/src/services/
git add client/src/types/
git add client/public/

# Docker & infrastructure
git add docker-compose.yml
git add setup-db.sh
git add .gitignore

# Documentation
git add *.md
git add client/INTEGRATION.md

# Test scripts
git add test-workflow.sh
```

### **Step 4: Commit with Clear Message**

```bash
git commit -m "feat: Implement backend API and frontend integration

- Add PostgreSQL with Docker and Prisma ORM
- Implement 30+ API endpoints (auth, requests, matches)
- Create frontend API services for React
- Add complete TypeScript types
- Configure JWT authentication
- Add comprehensive documentation
- Create database schema and seed data

Closes #1"
```

### **Step 5: Push to GitHub**

```bash
# First time pushing this branch
git push -u origin feature/backend-frontend-integration

# Future pushes (after this)
git push
```

---

## 👥 **Workflow for You and Your Teammate**

### **Daily Workflow**

#### **Morning Routine:**
```bash
# 1. Switch to main
git checkout main

# 2. Get latest changes
git pull origin main

# 3. Create new feature branch
git checkout -b feature/your-feature-name

# 4. Start coding!
```

#### **End of Day:**
```bash
# 1. Save your work
git add .
git commit -m "feat: description of what you built"

# 2. Push to GitHub
git push -u origin feature/your-feature-name

# 3. Create Pull Request on GitHub
```

### **When Teammate Has Updates:**
```bash
# Get their merged changes
git checkout main
git pull origin main

# Update your current branch with main
git checkout feature/your-feature
git merge main

# Or use rebase (cleaner history)
git rebase main
```

---

## 🔄 **Pull Request (PR) Workflow**

### **Creating a Pull Request**

1. **Push your branch:**
   ```bash
   git push -u origin feature/your-feature
   ```

2. **On GitHub.com:**
   - Go to your repository
   - Click "Pull requests" → "New pull request"
   - Base: `main` ← Compare: `feature/your-feature`
   - Add title and description
   - Request review from teammate
   - Click "Create pull request"

3. **PR Template (use this):**
   ```markdown
   ## What Changed
   - Implemented user authentication
   - Added login/register pages
   - Created protected routes

   ## How to Test
   1. Run `npm install` in server
   2. Run `docker compose up -d`
   3. Test login at http://localhost:3001/login

   ## Screenshots
   [Add if UI changes]

   ## Checklist
   - [x] Code works locally
   - [x] No console errors
   - [x] Updated documentation
   - [ ] Teammate reviewed
   ```

### **Reviewing a Pull Request**

**As a Reviewer:**
1. Pull the branch locally:
   ```bash
   git fetch origin
   git checkout feature/teammate-feature
   npm install  # if dependencies changed
   npm run dev  # test it
   ```

2. Review code on GitHub:
   - Check for bugs
   - Verify code quality
   - Test functionality
   - Leave comments

3. Approve or request changes

4. Merge when approved

---

## 🎯 **Branch Naming Convention**

Use descriptive names:

```bash
# Features
git checkout -b feature/user-authentication
git checkout -b feature/request-matching
git checkout -b feature/notification-system

# Bug fixes
git checkout -b fix/login-validation
git checkout -b fix/database-connection

# Documentation
git checkout -b docs/api-documentation
git checkout -b docs/setup-guide

# Refactoring
git checkout -b refactor/auth-service
```

---

## 💬 **Commit Message Convention**

Follow this format:

```bash
type: short description

Longer description (optional)

Related issue: #123
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Build, configs, dependencies

**Examples:**
```bash
git commit -m "feat: add user login endpoint"
git commit -m "fix: resolve database connection timeout"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify auth middleware"
```

---

## 🚨 **Avoiding Conflicts**

### **Rule 1: Communicate**
- Morning: "I'm working on the login page today"
- End of day: "I pushed my login feature to GitHub"
- Use GitHub Issues or a chat

### **Rule 2: Small, Frequent Commits**
```bash
# ❌ Bad: One huge commit at end of day
git commit -m "added everything"

# ✅ Good: Multiple small commits
git commit -m "feat: add login form component"
git commit -m "feat: add form validation"
git commit -m "feat: integrate with API"
```

### **Rule 3: Pull Before You Start**
```bash
# Every morning and before creating new branch
git checkout main
git pull origin main
```

### **Rule 4: Divide Work Clearly**

**Example Division:**
- **You:** Backend API, Database, Docker setup
- **Teammate:** Frontend UI, Components, Styling

Or by feature:
- **You:** Authentication system (both frontend & backend)
- **Teammate:** Request/Matching system (both frontend & backend)

---

## 🔧 **Handling Merge Conflicts**

### **When You Get a Conflict:**

```bash
# You'll see this when merging/pulling
Auto-merging src/App.tsx
CONFLICT (content): Merge conflict in src/App.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

### **How to Resolve:**

1. **Open the conflicted file:**
   ```typescript
   <<<<<<< HEAD (your changes)
   const apiUrl = 'http://localhost:4000';
   =======
   const apiUrl = 'http://localhost:5000';
   >>>>>>> feature/teammate-branch (their changes)
   ```

2. **Choose which to keep or combine:**
   ```typescript
   // Keep yours
   const apiUrl = 'http://localhost:4000';

   // Or keep theirs
   const apiUrl = 'http://localhost:5000';

   // Or combine
   const apiUrl = process.env.API_URL || 'http://localhost:4000';
   ```

3. **Mark as resolved:**
   ```bash
   git add src/App.tsx
   git commit -m "fix: resolve merge conflict in API URL"
   ```

---

## 📋 **Project Setup for Teammate**

### **First Time Setup (Your Teammate):**

```bash
# 1. Clone repository
git clone <your-repo-url>
cd CSR-Volunteer-Matching-System

# 2. Install dependencies
# Backend
cd server
npm install
cd ..

# Frontend
cd client
npm install
cd ..

# 3. Setup environment
cp server/.env.example server/.env
# Edit server/.env with their values

# 4. Start Docker
docker compose up -d

# 5. Setup database
cd server
npx prisma generate
npx prisma migrate dev
npm run seed
cd ..

# 6. Create their own branch
git checkout -b feature/their-first-task
```

---

## 🎯 **Recommended Workflow for Your Next Task**

### **For You (Current Changes):**

```bash
# 1. Commit current work
git checkout -b feature/backend-frontend-integration
git add .
git commit -m "feat: implement complete backend API and frontend integration

- PostgreSQL + Prisma setup
- 30+ API endpoints
- Frontend services
- Full documentation"

# 2. Push to GitHub
git push -u origin feature/backend-frontend-integration

# 3. Create Pull Request on GitHub
# (Don't merge yet - let teammate review)

# 4. Continue with next feature
git checkout main
git checkout -b feature/your-next-task
```

### **For Teammate (Next Task):**

```bash
# 1. Pull your changes
git checkout main
git pull origin main

# 2. Create their branch
git checkout -b feature/login-page

# 3. Work on their feature
# ... code ...

# 4. Commit and push
git add .
git commit -m "feat: create login page UI"
git push -u origin feature/login-page

# 5. Create PR and request your review
```

---

## 📊 **GitHub Project Organization**

### **Use GitHub Issues**

Create issues for tasks:
```markdown
**Title:** Implement User Authentication

**Description:**
- [ ] Backend: Login endpoint
- [ ] Backend: Register endpoint
- [ ] Frontend: Login form
- [ ] Frontend: Register form
- [ ] Testing

**Assignee:** You or Teammate
**Labels:** feature, high-priority
```

### **Use GitHub Projects (Kanban Board)**

Columns:
- 📋 **To Do** - Tasks not started
- 🚧 **In Progress** - Currently working
- 👀 **Review** - PR created, awaiting review
- ✅ **Done** - Merged to main

---

## 🛡️ **Protect Your Main Branch**

### **GitHub Settings:**

1. Go to **Settings** → **Branches**
2. Add rule for `main`:
   - ✅ Require pull request before merging
   - ✅ Require approvals: 1
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

This prevents direct pushes to main - everything goes through PR review.

---

## 🔄 **Common Commands Reference**

```bash
# Check status
git status
git log --oneline

# Branch management
git branch                    # List branches
git checkout -b feature/name  # Create new branch
git checkout main             # Switch to main
git branch -d feature/name    # Delete branch (local)

# Sync with remote
git pull origin main          # Get latest from GitHub
git push origin feature/name  # Push your branch
git fetch origin              # Download changes (don't merge)

# Undo changes
git restore file.txt          # Discard changes in file
git reset HEAD~1              # Undo last commit (keep changes)
git reset --hard HEAD~1       # Undo last commit (delete changes)

# Stash (temporary save)
git stash                     # Save current changes
git stash pop                 # Restore stashed changes
git stash list                # List stashes
```

---

## 📅 **Weekly Routine**

### **Monday Morning:**
- Review last week's merged PRs
- Plan this week's features
- Create GitHub issues for tasks
- Assign issues to team members

### **Daily:**
- Morning: Pull latest, create feature branch
- During day: Commit frequently
- Evening: Push branch, create PR if complete

### **Friday:**
- Review all open PRs
- Merge completed features
- Deploy/test integrated features
- Plan next week

---

## ⚡ **Quick Start Commands for Right Now**

### **Commit Your Current Work:**

```bash
# Create feature branch
git checkout -b feature/backend-frontend-setup

# Stage all changes
git add .

# Commit with message
git commit -m "feat: implement complete backend and frontend integration

- Add PostgreSQL with Docker & Prisma
- Implement 30+ REST API endpoints
- Create frontend API services (auth, requests, matches)
- Add TypeScript types for all responses
- Configure JWT authentication
- Add comprehensive documentation (9 MD files)
- Create database schema and seed data
- Add test workflow script

This completes the core infrastructure for the CSR platform."

# Push to GitHub
git push -u origin feature/backend-frontend-setup
```

Then go to GitHub and create a Pull Request!

---

## 📚 **Resources**

- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
- **GitHub Flow:** https://guides.github.com/introduction/flow/
- **Conventional Commits:** https://www.conventionalcommits.org/

---

## ✅ **Best Practices Summary**

1. ✅ Always work on feature branches, never directly on main
2. ✅ Pull latest changes before starting new work
3. ✅ Commit small, logical changes frequently
4. ✅ Write clear, descriptive commit messages
5. ✅ Push your branch daily
6. ✅ Create PRs for all changes
7. ✅ Review teammate's code before merging
8. ✅ Communicate what you're working on
9. ✅ Keep main branch always deployable
10. ✅ Delete branches after merging

---

**Your workflow is now professional and organized! 🎉**

