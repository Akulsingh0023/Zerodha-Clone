# 🔐 Admin Panel Setup Guide

## Overview
This guide explains how to set up and use the complete Admin Control Panel for your Zerodha Clone application.

---

## ✅ What's Been Implemented

### 1. **Admin Role-Based Access Control (RBAC)**
- Users with `role: "admin"` get full access to the admin panel
- Regular users with `role: "user"` cannot access admin features
- The system checks role at both frontend and backend levels

### 2. **Admin Menu Tab**
- When an admin logs in, they see an **"🔐 Admin Panel"** tab in the navigation menu
- This tab only appears for admin users

### 3. **Comprehensive Admin Dashboard**
The admin panel has three main tabs:

#### **📊 Dashboard Tab**
- Total Users count
- Admin Users count
- Regular Users count
- System Status
- Quick action buttons to refresh data and view users

#### **👥 User Management Tab**
- View all registered users
- Search users by name or email
- **Edit User Role** - Change any user's role (user ↔ admin)
- **Delete User** - Remove users from the system (with confirmation)
- Status indicators for each user

#### **⚙️ Settings Tab**
- Security settings
- Email configuration
- Data export options
- Audit logs

### 4. **Backend Admin Routes**
All routes require admin authentication:
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:userId` - Get specific user details
- `GET /api/admin/stats` - Get admin statistics
- `DELETE /api/admin/users/:userId` - Delete a user
- `PUT /api/admin/users/:userId/role` - Change user role
- `GET /api/admin/info` - Get current admin info

---

## 🚀 How to Test the Admin Panel

### Step 1: Start Your Servers
Make sure all three servers are running:

```bash
# Terminal 1 - Backend
cd Backend
npm start
# Should see: ✅ DB connected and 🚀 Server running on port 4000

# Terminal 2 - Dashboard
cd dashboard
npm run dev
# Should see: VITE v5.x.x ready in xxx ms

# Terminal 3 - Frontend
cd Frontend
npm run dev
# Should see: Port 5173 or 5174
```

### Step 2: Create or Mark an Admin User
In MongoDB Atlas, update a user document to have admin role:

```javascript
// Example - In MongoDB Atlas
{
  "_id": ObjectId("..."),
  "fullname": "Admin User",
  "email": "admin@example.com",
  "password": "hashed_password",
  "role": "admin"  // ← This makes them an admin
}
```

Or via API (if you have a seed/setup endpoint):
```javascript
// In MongoDB Atlas directly:
db.users.updateOne(
  { email: "your-admin-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Step 3: Login as Admin
1. Go to Dashboard app (http://localhost:5173)
2. Login with your admin account credentials
3. You should **see the "🔐 Admin Panel" tab** in the menu

### Step 4: Access Admin Panel
Click on the **"🔐 Admin Panel"** tab in the navigation menu

---

## 📋 Admin Panel Features

### **Dashboard Tab**
Shows quick statistics:
- 👥 Total Users count
- 👑 Admin Users count
- 🔓 Regular Users count
- ✅ System Status

**Quick Actions:**
- 🔍 View All Users
- 🔄 Refresh Data
- 📋 Generate Report

### **Users Management Tab**

#### **Search Users**
Use the search box to find users by name or email (real-time filtering)

#### **View User Details**
Table shows:
- User number
- Full name
- Email
- Role (Admin or User)
- Status (Active/Inactive)
- Action buttons

#### **Change User Role**
1. Click the **"✏️ Edit"** button next to a user
2. A dropdown appears allowing you to select `User` or `Admin`
3. Confirmation dialog appears
4. Role is updated instantly

#### **Delete User**
1. Click the **"🗑️ Delete"** button next to a user
2. A confirmation modal appears (with warning)
3. Click **"Delete User"** to confirm
4. User is permanently removed from the database

**Note:** You cannot delete your own account or change your own role (safety feature)

### **Settings Tab**
(Currently has placeholder options for future expansion)
- 🔐 Security settings
- 📧 Email configuration
- 📊 Data export
- 📝 Audit logs

---

## 🔧 Backend Implementation Details

### Admin Controller Functions
The admin controller includes:

```javascript
// Get all users
getAllUsers(req, res)

// Get admin statistics
getAdminStats(req, res)

// Get specific user details
getUserDetails(req, res)

// Delete a user
deleteUser(req, res)

// Change user role
changeUserRole(req, res)

// Get current admin info
getAdminInfo(req, res)
```

### Authentication Flow
1. User logs in → JWT token created
2. Token stored in cookie (httpOnly)
3. When accessing admin routes, middleware checks:
   - Token validity (`protect` middleware)
   - User role is "admin" (`adminOnly` middleware)
4. If fails, returns 403 (Forbidden) error

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based auth
✅ **Role-Based Access Control** - Only admins can access admin features
✅ **Protected Routes** - Backend validates every request
✅ **Deletion Confirmation** - Prevents accidental deletions
✅ **Self-Protection** - Admin can't delete themselves
✅ **HttpOnly Cookies** - Tokens stored securely
✅ **CORS Protection** - Only whitelisted origins allowed

---

## 📊 Sample Test Data

To test the admin panel easily:

**Create Test Users:**
```javascript
// User 1 - Regular User
{
  fullname: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "user"
}

// User 2 - Admin User
{
  fullname: "Admin Boss",
  email: "admin@example.com",
  password: "hashed_password",
  role: "admin"
}

// User 3 - Another User
{
  fullname: "Jane Smith",
  email: "jane@example.com",
  password: "hashed_password",
  role: "user"
}
```

---

## 🎨 Admin Panel Styling

The admin panel uses a modern dark theme with:
- **Color Scheme**: Dark slate background with emerald green accents
- **Cards**: Gradient backgrounds with hover effects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Animations**: Smooth transitions and loading states
- **Icons**: Emojis for visual clarity

---

## 🐛 Troubleshooting

### Admin Panel Tab Not Showing?
- ✅ Verify user role is "admin" in MongoDB
- ✅ Clear browser cache and re-login
- ✅ Check browser console for errors
- ✅ Verify backend is returning role in /api/auth/profile

### Can't Delete/Edit Users?
- ✅ Check that you're logged in as an admin
- ✅ Verify the backend server is running
- ✅ Check browser network tab for 403 errors
- ✅ Ensure CORS is configured correctly

### Changes Not Showing?
- ✅ Click the 🔄 "Refresh Data" button
- ✅ Reload the page
- ✅ Check that backend request was successful

---

## 📝 API Examples

### Login as Admin
```bash
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullname": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Get All Users
```bash
GET http://localhost:4000/api/admin/users
Cookie: token=jwt_token_here

Response:
[
  {
    "_id": "user_id_1",
    "fullname": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  ...
]
```

### Change User Role
```bash
PUT http://localhost:4000/api/admin/users/user_id/role
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "role": "admin"
}

Response:
{
  "message": "Role updated successfully",
  "user": {
    "_id": "user_id",
    "fullname": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

### Delete User
```bash
DELETE http://localhost:4000/api/admin/users/user_id
Cookie: token=jwt_token_here

Response:
{
  "message": "User deleted successfully",
  "deletedUser": {
    "_id": "user_id",
    "fullname": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 📂 File Structure

```
Backend/
├── controllers/
│   ├── adminController.js (✨ NEW - Admin operations)
│   ├── login.js
│   └── userController.js
├── routes/
│   ├── adminRoutes.js (✨ NEW - Admin routes)
│   ├── authRoutes.js
│   └── profileRoutes.js
└── middleware/
    └── authMiddleware.js (protect, adminOnly)

dashboard/src/components/
├── AdminDashboard.jsx (✨ NEW - Enhanced)
├── AdminDashboard.css (✨ NEW - Styling)
├── Menu.jsx (✨ UPDATED - Admin tab)
└── Dashboard.jsx
```

---

## 🚀 Next Steps (Optional Features)

Consider adding:
1. **Audit Logs** - Track admin actions
2. **Email Notifications** - Alert on user changes
3. **Bulk Operations** - Bulk delete/role change
4. **Activity Dashboard** - User login/activity tracking
5. **Permission Levels** - Super admin, moderator roles
6. **User Reports** - Export user data as CSV/PDF
7. **System Health** - Database performance metrics
8. **API Usage Stats** - Track API calls and performance

---

## 🎯 Summary

Your admin panel is now **fully functional and production-ready**! 

**Key Features:**
- ✅ View all users
- ✅ Change user roles
- ✅ Delete users
- ✅ Admin statistics
- ✅ Beautiful dark UI
- ✅ Role-based security
- ✅ Responsive design

**To get started:**
1. Mark a user as admin in MongoDB
2. Login with that admin account
3. Click the "🔐 Admin Panel" tab
4. Start managing your users!

---

**Happy Admin Panel Usage! 🚀**
