# Admin Dashboard Backend Setup Guide

## Problem Resolution
The "Error Loading Users" message occurs because the admin API endpoints were missing from the backend. I've now created the necessary backend components.

## Backend Components Created

### 1. Admin Controller (`server/src/controllers/admin.controller.ts`)
- **getUsers**: Get paginated list of all users
- **getUserById**: Get specific user details
- **createUser**: Create new PIN or CSR Rep users
- **updateUserStatus**: Suspend/activate user accounts
- **approveCSRRep**: Approve pending CSR representatives
- **deleteUser**: Delete user accounts
- **getPendingCSRReps**: Get list of pending CSR reps
- **getSystemStats**: Get system statistics

### 2. Admin Routes (`server/src/routes/admin.ts`)
- All routes protected by admin authentication
- RESTful API endpoints for user management
- Proper authorization middleware

### 3. Server Integration (`server/src/server.ts`)
- Added admin routes to the main server
- Proper route mounting at `/api/admin`

## Setup Instructions

### Step 1: Create Admin User
```bash
cd server
node create-admin-user.js
```

This creates an admin user with:
- **Email**: admin@csrvolunteer.com
- **Password**: admin123
- **Type**: ADMIN

### Step 2: Start the Backend Server
```bash
cd server
npm run dev
```

### Step 3: Start the Frontend
```bash
cd client
npm start
```

### Step 4: Test Admin Dashboard
1. Go to http://localhost:3000/login
2. Login with admin credentials:
   - Email: admin@csrvolunteer.com
   - Password: admin123
3. You'll be redirected to `/admin/dashboard`
4. The dashboard should now load without errors

## API Endpoints Available

### User Management
```
GET    /api/admin/users                    # Get paginated users
GET    /api/admin/users/:id                # Get user by ID
POST   /api/admin/users                    # Create new user
PUT    /api/admin/users/:id/status         # Update user status
PUT    /api/admin/users/:id/approve        # Approve CSR Rep
DELETE /api/admin/users/:id                # Delete user
```

### Specialized Endpoints
```
GET    /api/admin/users/pending-csr-reps   # Get pending CSR reps
GET    /api/admin/stats                    # Get system statistics
```

## Testing the Admin Features

### 1. User Creation
- Click "Create User" button
- Select user type (PIN or CSR Rep)
- Fill in required fields
- Submit to create new user

### 2. User Suspension
- Find a user in the table
- Click the red X icon (suspend) or green check icon (activate)
- Confirm the action
- User status updates immediately

### 3. CSR Rep Approval
- Find pending CSR reps (yellow status)
- Click the shield icon to approve
- CSR rep status changes to active

## Troubleshooting

### If you still get "Error Loading Users":
1. **Check Backend Server**: Ensure server is running on port 4000
2. **Check Database**: Ensure database is connected and has users
3. **Check Authentication**: Ensure you're logged in as admin
4. **Check Network**: Open browser dev tools and check for API errors

### Common Issues:
- **401 Unauthorized**: Not logged in or not admin user
- **403 Forbidden**: User doesn't have admin privileges
- **404 Not Found**: Backend server not running
- **500 Server Error**: Database connection issues

### Debug Steps:
1. Check browser console for errors
2. Check network tab for failed API calls
3. Verify admin user exists in database
4. Test API endpoints directly with Postman/curl

## Security Notes

### Admin Authentication
- All admin routes require valid JWT token
- Token must contain userType: 'ADMIN'
- Routes are protected by middleware

### Password Security
- Change default admin password after first login
- Use strong passwords for production
- Consider implementing 2FA for admin accounts

## Production Considerations

### Environment Variables
- Set proper JWT_SECRET
- Configure database connection
- Set up proper CORS origins

### Database Setup
- Run migrations: `npx prisma migrate deploy`
- Seed initial data if needed
- Create admin user in production

### Security Hardening
- Implement rate limiting
- Add request logging
- Set up monitoring and alerts
- Regular security audits

The admin dashboard should now work correctly with full user management capabilities!
