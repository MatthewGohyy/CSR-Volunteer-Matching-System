# 🖥️ How to Test the UI - Complete Guide

**Your application has a React frontend!** Here's how to test it like a real user.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Make Sure Backend is Running

Your backend should already be running on **http://localhost:4000**

Check if it's running:
```bash
curl http://localhost:4000/health
```

If not running, start it:
```bash
cd server
npm run dev
```

### Step 2: Start the Frontend

Open a **NEW terminal** (keep the backend running) and run:

```bash
cd client
npm start
```

This will:
- Start the React development server
- Automatically open your browser to **http://localhost:3000**
- Hot-reload when you make changes

### Step 3: Login and Test!

Use the test accounts we created:

| User Type | Email | Password | What You Can Do |
|-----------|-------|----------|-----------------|
| **Admin** | `admin@test.com` | `password123` | Manage all users, view profiles, system stats |
| **PIN** | `pin@test.com` | `password123` | Create requests, view matches, notifications |
| **CSR Rep** | `csrrep@test.com` | `password123` | Browse requests, shortlist, make offers |

---

## 🎨 What You'll See

### Login Page
- Clean login form
- Email and password fields
- Role-based routing after login

### Admin Dashboard
- View all users
- Search users and profiles
- System statistics
- User management

### PIN (Volunteer) Dashboard
- Create help requests
- View your requests
- See matches with organizations
- Check notifications
- View request history

### CSR Rep (Organization) Dashboard
- Browse available requests
- Search for opportunities
- Shortlist requests
- Submit volunteer offers
- View matches

---

## 🔧 Troubleshooting

### Frontend Won't Start

**Error: "Port 3000 is already in use"**
```bash
# Option 1: Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use a different port
PORT=3001 npm start
```

**Error: "Module not found"**
```bash
# Install dependencies
cd client
npm install
```

### Backend Connection Issues

**Error: "Network Error" or "CORS Error"**

Check your client `.env` file:
```bash
cd client
cat .env
```

Should contain:
```
REACT_APP_API_URL=http://localhost:4000/api
```

If file doesn't exist, create it:
```bash
echo "REACT_APP_API_URL=http://localhost:4000/api" > .env
```

### Login Not Working

Make sure test users exist:
```bash
cd server
npx ts-node create-test-users.ts
```

---

## 🧪 Testing Scenarios

### Test as Admin

1. **Login** with `admin@test.com / password123`
2. **View Users**: Click "Users" in navigation
3. **Search Users**: Try searching for "test" or "john"
4. **View Profiles**: Navigate to profiles section
5. **Check Stats**: View system statistics dashboard

### Test as PIN (Volunteer)

1. **Login** with `pin@test.com / password123`
2. **Create Request**: Fill out the help request form
3. **View Requests**: See your list of requests
4. **Check Notifications**: View notification panel
5. **View History**: Check completed requests

### Test as CSR Rep (Organization)

1. **Login** with `csrrep@test.com / password123`
2. **Browse Requests**: See available volunteer opportunities
3. **Search**: Try searching for specific types of help
4. **Shortlist**: Add interesting requests to your shortlist
5. **View Shortlist**: Access your saved requests
6. **View History**: Check your organization's activity

---

## 🎯 Key Features to Test

### Authentication
- ✅ Login with different user types
- ✅ Logout functionality
- ✅ Protected routes (try accessing admin without login)
- ✅ Token persistence (refresh page while logged in)

### User Management (Admin)
- ✅ View all users with pagination
- ✅ Search by email, name, company
- ✅ View user profiles
- ✅ System statistics

### Request Management (PIN)
- ✅ Create new requests
- ✅ View your requests
- ✅ Search your requests
- ✅ Update request status
- ✅ View request analytics

### Request Browsing (CSR Rep)
- ✅ Browse all available requests
- ✅ Search and filter
- ✅ Add to shortlist
- ✅ View shortlisted requests
- ✅ Submit offers

---

## 📱 Browser Compatibility

The app works best on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## 🔍 Developer Tools

### Open Browser DevTools (F12 or Right-click → Inspect)

**Network Tab:**
- See all API calls to backend
- Check request/response data
- Verify authentication tokens

**Console Tab:**
- View application logs
- Check for JavaScript errors
- Debug issues

**Application Tab:**
- View localStorage (JWT tokens)
- Check cookies
- Inspect cache

---

## 🎨 UI Components

Your app uses:
- **React** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API calls
- **React Query** - Data fetching
- **Lucide Icons** - Icon library

---

## 📊 Monitoring API Calls

While using the UI, watch your backend terminal to see API calls in real-time:

```
POST /api/auth/login - 200 OK
GET /api/admin/users - 200 OK
GET /api/opportunities - 200 OK
```

This helps you verify that:
- Frontend is calling the correct endpoints
- Backend is responding properly
- Your refactored controllers are working

---

## 🔄 Development Workflow

### Making Changes

**Backend Changes:**
1. Edit files in `server/src/`
2. Server auto-reloads (nodemon)
3. Refresh browser to see changes

**Frontend Changes:**
1. Edit files in `client/src/`
2. Browser auto-reloads (hot reload)
3. Changes appear immediately

### Testing After Changes

1. **Backend:** API tests still pass
   ```bash
   ./comprehensive-test.sh
   ```

2. **Frontend:** UI still works
   - Login/logout
   - Navigate pages
   - Check console for errors

---

## 🎯 Complete Testing Checklist

### Before Testing
- [ ] Database running
- [ ] Backend server running (port 4000)
- [ ] Test users created
- [ ] Frontend running (port 3000)

### Admin Tests
- [ ] Login as admin
- [ ] View users list
- [ ] Search users
- [ ] View user profiles
- [ ] Check system stats
- [ ] Logout

### PIN Tests
- [ ] Login as PIN
- [ ] View dashboard
- [ ] Create request (if form available)
- [ ] View my requests
- [ ] Check notifications
- [ ] Logout

### CSR Rep Tests
- [ ] Login as CSR Rep
- [ ] Browse requests
- [ ] Search requests
- [ ] Add to shortlist
- [ ] View shortlist
- [ ] Logout

### Security Tests
- [ ] Cannot access admin pages as PIN
- [ ] Cannot access PIN pages as CSR Rep
- [ ] Redirected to login when not authenticated
- [ ] Token persists on page refresh

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot connect to backend"
**Solution:**
```bash
# Check backend is running
curl http://localhost:4000/health

# Check frontend .env
cat client/.env
# Should show: REACT_APP_API_URL=http://localhost:4000/api
```

### Issue: "Unauthorized" after login
**Solution:**
- Clear browser localStorage (F12 → Application → Storage)
- Logout and login again
- Check if JWT token is being saved

### Issue: "Page not found"
**Solution:**
- Check React Router configuration
- Verify routes in `client/src/App.tsx`
- Check browser console for errors

### Issue: "Blank page"
**Solution:**
- Check browser console for errors
- Check backend terminal for API errors
- Verify test users exist in database

---

## 📞 Quick Commands Reference

```bash
# Start backend
cd server && npm run dev

# Start frontend (in new terminal)
cd client && npm start

# Create test users
cd server && npx ts-node create-test-users.ts

# Test API endpoints
./comprehensive-test.sh

# Check backend health
curl http://localhost:4000/health

# View frontend in browser
open http://localhost:3000
```

---

## 🎉 You're Ready!

Now you can:
1. **Open your browser** to http://localhost:3000
2. **Login** with any test account
3. **Explore** the full application
4. **Test** all user stories interactively
5. **See** your refactored controllers in action!

The UI provides a much better testing experience than curl commands - you can click around, fill forms, and interact with the application just like a real user would!

---

## 💡 Pro Tips

1. **Keep both terminals open** - one for backend logs, one for frontend
2. **Use browser DevTools** - Network tab shows all API calls
3. **Test different user types** - Each sees different features
4. **Check backend logs** - See which controllers are being called
5. **Use React DevTools** - Chrome extension for React debugging

**Happy Testing! 🚀**
