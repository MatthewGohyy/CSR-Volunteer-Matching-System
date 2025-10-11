# 💬 Message for Your Teammate

**Copy and send this to your friend who's getting the `.env` error:**

---

Hey bro! That error happens because the `.env` file isn't in Git (for security). Here's the fix:

## 🚀 **Quick Fix (30 seconds):**

Run this from the project root:

```bash
cat > server/.env << 'EOF'
DATABASE_URL="postgresql://dev:dev123@localhost:5432/csr_platform"
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173
EOF
```

Then run the setup script again:
```bash
./setup-db.sh
```

That's it! ✅

---

## 📖 **More Details:**

If you want to understand what happened, check:
- **[ENV_SETUP.md](ENV_SETUP.md)** - Full .env guide
- **[TEAMMATE_SETUP.md](TEAMMATE_SETUP.md)** - Complete setup (Step 4 has this)

The `.env` file has your database credentials and secrets, so it's never committed to Git. Everyone needs to create it locally.

---

**Pro tip:** Bookmark [DOCS_INDEX.md](DOCS_INDEX.md) - it has links to all guides! 🔖

