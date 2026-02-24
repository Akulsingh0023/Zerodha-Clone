# Admin Panel - Troubleshooting Guide

## Common Issues and Solutions

---

## ❌ "Admin Panel tab not showing"

### Issue
You logged in as admin but don't see the "🔐 Admin Panel" tab in the menu.

### Solutions

#### Solution 1: Check User Role in Database
```javascript
// In MongoDB Atlas, check if user has admin role
db.users.findOne({ email: "your-email@example.com" })

// Should show:
{ 
  "_id": ObjectId(...),
  "fullname": "Your Name",
  "email": "your-email@example.com",
  "role": "admin"  // ← This must be present
}
```

#### Solution 2: Clear Browser Cache
1. Open DevTools (F12)
2. Go to Application → Cookies
3. Delete the `token` cookie
4. Refresh the page
5. Login again

#### Solution 3: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors like:
   - Network errors in red
   - 401/403 responses
   - Failed API calls

#### Solution 4: Verify Backend is Running
```bash
# Backend should be running
cd Backend
npm start

# Check terminal shows:
# ✅ DB connected
# 🚀 Server running on port 4000
```

#### Solution 5: Check Fetch URL
In Menu.jsx, it should call:
```javascript
const res = await axios.get(
  `${BASE_URL}/api/auth/profile`,  // ← Correct URL
  { withCredentials: true }
);
```

---

## ❌ "Admin tab shows but can't enter admin panel"

### Issue
Admin tab appears but clicking it shows "Checking admin access..." forever or redirects to home.

### Solutions

#### Solution 1: Check AdminRoute Component
```javascript
// In AdminRoute.jsx, verify the endpoint:
axios.get("http://localhost:4000/api/me", {
  withCredentials: true
})

// Should return role in response
```

#### Solution 2: Verify Backend /api/me Endpoint
```bash
# Check that /api/me returns role
curl -X GET http://localhost:4000/api/me \
  -H "Cookie: token=your_token"

# Response should include role:
{
  "email": "admin@example.com",
  "role": "admin",
  ...
}
```

#### Solution 3: Check Axios Interceptor
Make sure axios is configured with credentials:
```javascript
// In axiosConfig.js or where axios is configured:
axios.defaults.withCredentials = true;
```

#### Solution 4: CORS Issue
If you see CORS error in console:
- Backend CORS should allow your frontend URL
- Remove whitespace from origin array
- Restart backend server

```javascript
// In Backend/index.js
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true  // ← Important!
}));
```

---

## ❌ "404 Error when accessing admin endpoints"

### Issue
Clicking on users/dashboard gives 404 errors.

### Solutions

#### Solution 1: Check Admin Routes are Imported
```javascript
// In Backend/index.js:
import adminRoutes from "./routes/adminRoutes.js";  // ← Must be imported

// And registered:
app.use("/api/admin", adminRoutes);  // ← Must be registered
```

#### Solution 2: Verify Endpoint Format
- ❌ Wrong: `/admin/users`
- ❌ Wrong: `/api/users`
- ✅ Correct: `/api/admin/users`

#### Solution 3: Restart Backend
```bash
# Kill the backend process (Ctrl+C)
# Then restart:
cd Backend
npm start
```

---

## ❌ "Forbidden (403) error on admin endpoints"

### Issue
Getting 403 Forbidden when trying to access admin endpoints.

### Solutions

#### Solution 1: Verify User is Admin
```javascript
// Check in MongoDB:
db.users.findById("your_id")
// role should be "admin"
```

#### Solution 2: Check JWT Token
```javascript
// The JWT should have admin role encoded
// Verify in AdminRoute.jsx that role is "admin"
if (res.data.role === "admin") {
  setIsAdmin(true);  // ← Must be exactly true
}
```

#### Solution 3: Token Might Be Expired
- Login again to get fresh token
- DevTools → Application → Cookies → Delete token → Refresh → Login

#### Solution 4: Check Middleware Order
In Backend/index.js:
```javascript
// ✅ Correct order:
app.use("/api/auth", authRoutes);  // Auth routes first
app.use("/api/admin", adminRoutes);  // Admin routes after

// ❌ Don't do this:
app.use("/api/admin", adminRoutes);  // Wrong if auth routes not loaded first
```

---

## ❌ "Users list is empty"

### Issue
Admin panel loads but users table is empty.

### Solutions

#### Solution 1: Check Database
```javascript
// In MongoDB Atlas:
db.users.countDocuments()  // Should return > 0

// List all users:
db.users.find()
```

#### Solution 2: Check API Response
```javascript
// In browser console:
fetch('http://localhost:4000/api/admin/users', {
  method: 'GET',
  credentials: 'include'
})
.then(r => r.json())
.then(d => console.log(d))

// Should show array of users
```

#### Solution 3: Check User Model
```javascript
// In Backend/model/User.js
// Schema should have fullname, email, role fields
const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  ...
});
```

---

## ❌ "Can't delete user"

### Issue
Delete button doesn't work or shows error.

### Solutions

#### Solution 1: Can't Delete Yourself
This is by design! You cannot delete your own admin account.
- Logout and login as different admin
- Then delete the other user

#### Solution 2: Check Error Message
```javascript
// In browser console after delete attempt:
// Look for response error like:
{
  "message": "Cannot delete your own account"
  // or
  "message": "User not found"
  // or
  "message": "Server error"
}
```

#### Solution 3: Network Error
- Check DevTools → Network tab
- Click the failed request
- Look at Response tab for error details

#### Solution 4: Backend Permission Issue
```javascript
// In adminController.js, deleteUser must have:
if (req.user._id.toString() === userId) {
  return res.status(400).json({ 
    message: "Cannot delete your own account" 
  });
}
```

---

## ❌ "Can't change user role"

### Issue
Edit role button doesn't update the role.

### Solutions

#### Solution 1: Role Not Changing
```javascript
// After selecting role and submitting:
// Check browser console for response
// Should see: "Role updated successfully"
```

#### Solution 2: Refresh Data
- Click 🔄 "Refresh Data" button
- Or reload the page (F5)
- The updated role should appear

#### Solution 3: Check API Request
In browser DevTools → Network tab:
1. Click Edit button
2. Select new role
3. Check PUT request to `/api/admin/users/{id}/role`
4. Request body should have: `{"role": "admin"}`

#### Solution 4: Self-Protection
You cannot change your own role. This is by design.
- Your role can only be changed by another admin
- Or directly in MongoDB

---

## ❌ "Styles look weird / Not loading properly"

### Issue
Admin panel loads but styling is broken or missing.

### Solutions

#### Solution 1: CSS File Missing
Check that AdminDashboard.css exists:
```bash
ls dashboard/src/components/AdminDashboard.css
```

#### Solution 2: Vite Not Reloading
```bash
# Kill vite dev server (Ctrl+C)
# Restart:
cd dashboard
npm run dev
```

#### Solution 3: Cache Issue
```bash
# Clear browser cache:
# F12 → Network tab → Check "Disable cache"
# Or hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
```

#### Solution 4: CSS Import
Check AdminDashboard.jsx has:
```javascript
import "./AdminDashboard.css";  // ← This line must be present
```

---

## ❌ "Network errors / CORS errors"

### Issue
Seeing CORS errors in console when accessing admin panel.

### Solutions

#### Solution 1: CORS Configuration
```javascript
// In Backend/index.js, add:
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));
```

#### Solution 2: Credentials Flag
```javascript
// When making requests from frontend:
axios.get(url, {
  withCredentials: true  // ← Must be true
})

// Or with fetch:
fetch(url, {
  credentials: 'include'  // ← Or this
})
```

#### Solution 3: Cookie Parser Middleware
```javascript
// In Backend/index.js:
import cookieParser from "cookie-parser";

app.use(cookieParser());
```

#### Solution 4: Restart Both Servers
```bash
# Kill backend (Ctrl+C)
# Kill frontend/dashboard (Ctrl+C)
# Restart both:

# Terminal 1:
cd Backend && npm start

# Terminal 2:
cd dashboard && npm run dev
```

---

## ❌ "Statistics showing wrong numbers"

### Issue
Total users count is incorrect or not updating.

### Solutions

#### Solution 1: Refresh Data
Click the 🔄 "Refresh Data" button to recalculate stats.

#### Solution 2: Check Database
```javascript
// In MongoDB Atlas:
db.users.countDocuments()  // Total users
db.users.countDocuments({ role: "admin" })  // Total admins
db.users.countDocuments({ role: "user" })  // Total regular users
```

#### Solution 3: Verify API Response
```javascript
// Test /api/admin/stats endpoint:
fetch('http://localhost:4000/api/admin/stats', {
  credentials: 'include'
})
.then(r => r.json())
.then(d => console.log(d))

// Should return: { totalUsers, totalAdmins, totalRegularUsers }
```

#### Solution 4: Check API Code
In adminController.js:
```javascript
export const getAdminStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalAdmins = await User.countDocuments({ role: "admin" });
  const totalRegularUsers = await User.countDocuments({ role: "user" });
  // ...
}
```

---

## ❌ "Search not working"

### Issue
Can't search for users by name or email.

### Solutions

#### Solution 1: Check Search State
```javascript
// In AdminDashboard.jsx:
const [searchTerm, setSearchTerm] = useState("");

// Input should update state:
onChange={(e) => setSearchTerm(e.target.value)}
```

#### Solution 2: Filter Logic
```javascript
// Should filter users:
const filteredUsers = users.filter((user) =>
  user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  user.email?.toLowerCase().includes(searchTerm.toLowerCase())
);

// Then use:
{filteredUsers.map((user) => (...))}
```

---

## ✅ Quick Diagnostic Commands

Run these to check system status:

```bash
# 1. Check backend is running
curl http://localhost:4000/api/me

# 2. Check MongoDB connection
# Try connecting from MongoDB Atlas interface

# 3. Check admin user exists
# db.users.findOne({ role: "admin" })

# 4. Clear browser data
# F12 → Application → Storage → Clear Site Data

# 5. Restart all servers
# Kill all terminals
# Start fresh in three terminals
```

---

## 📞 Need More Help?

1. **Check browser console** (F12) for error messages
2. **Check backend logs** for error details
3. **Check MongoDB data** to verify user roles
4. **Check Network tab** to see API responses
5. **Try clearing cache** and restarting servers

---

## 🚀 If Everything Else Fails

Try this nuclear option:

```bash
# 1. Kill all servers (Ctrl+C in each terminal)

# 2. Clear all node_modules and reinstall
cd Backend
rm -rf node_modules package-lock.json
npm install
npm start

# Terminal 2:
cd dashboard
rm -rf node_modules package-lock.json
npm install
npm run dev

# 3. Clear browser cache
# F12 → Application → Clear All

# 4. Restart browser completely
# Close all windows and reopen

# 5. Login fresh and test
```

---

**Still having issues? Check the logs! 🔍**
