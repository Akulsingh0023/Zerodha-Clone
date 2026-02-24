# Admin API Documentation

## Base URL
```
http://localhost:4000/api/admin
```

## Authentication
All requests require:
- **Cookie:** `token=jwt_token` (HttpOnly)
- **Credentials:** `withCredentials: true`

---

## Endpoints

### 1. Get All Users
```http
GET /users
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "fullname": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
]
```

---

### 2. Get User Details
```http
GET /users/:userId
```

**Parameters:**
- `userId` (string) - User ID from MongoDB

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullname": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Error:**
```json
{
  "message": "User not found"
}
```

---

### 3. Get Admin Statistics
```http
GET /stats
```

**Response:**
```json
{
  "totalUsers": 100,
  "totalAdmins": 5,
  "totalRegularUsers": 95,
  "timestamp": "2024-02-24T10:30:00.000Z"
}
```

---

### 4. Get Current Admin Info
```http
GET /info
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullname": "Admin User",
  "email": "admin@example.com",
  "role": "admin"
}
```

---

### 5. Change User Role
```http
PUT /users/:userId/role
Content-Type: application/json

{
  "role": "admin"
}
```

**Parameters:**
- `userId` (string) - User ID
- `role` (string) - "user" or "admin"

**Response:**
```json
{
  "message": "Role updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**Errors:**
```json
{
  "message": "Invalid role"
}
```

```json
{
  "message": "Cannot change your own role"
}
```

```json
{
  "message": "User not found"
}
```

---

### 6. Delete User
```http
DELETE /users/:userId
```

**Parameters:**
- `userId` (string) - User ID

**Response:**
```json
{
  "message": "User deleted successfully",
  "deletedUser": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Errors:**
```json
{
  "message": "Cannot delete your own account"
}
```

```json
{
  "message": "User not found"
}
```

```json
{
  "message": "Server error"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (Invalid data) |
| 403 | Forbidden (Not admin) |
| 404 | Not Found |
| 500 | Server Error |

---

## JavaScript Fetch Examples

### Get All Users
```javascript
fetch('http://localhost:4000/api/admin/users', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

### Get User Details
```javascript
fetch('http://localhost:4000/api/admin/users/507f1f77bcf86cd799439011', {
  method: 'GET',
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log(data));
```

### Change User Role
```javascript
fetch('http://localhost:4000/api/admin/users/507f1f77bcf86cd799439011/role', {
  method: 'PUT',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    role: 'admin'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Delete User
```javascript
fetch('http://localhost:4000/api/admin/users/507f1f77bcf86cd799439011', {
  method: 'DELETE',
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log(data));
```

### Get Statistics
```javascript
fetch('http://localhost:4000/api/admin/stats', {
  method: 'GET',
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Axios Examples

```javascript
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/admin';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

// Get all users
api.get('/users')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));

// Get user details
api.get('/users/507f1f77bcf86cd799439011')
  .then(res => console.log(res.data));

// Change role
api.put('/users/507f1f77bcf86cd799439011/role', {
  role: 'admin'
})
.then(res => console.log(res.data));

// Delete user
api.delete('/users/507f1f77bcf86cd799439011')
  .then(res => console.log(res.data));

// Get stats
api.get('/stats')
  .then(res => console.log(res.data));
```

---

## Error Handling Examples

```javascript
async function getAllUsers() {
  try {
    const response = await fetch('http://localhost:4000/api/admin/users', {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 403) {
        console.error('Access denied - Not an admin');
      } else if (response.status === 401) {
        console.error('Not authenticated - Please login');
      }
      return;
    }

    const users = await response.json();
    console.log('Users:', users);
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production:
- Limit password changes to 5 per hour
- Limit user deletions to prevent abuse
- Implement exponential backoff for failed requests

---

## Security Notes

1. **Never expose admin tokens to frontend localStorage** - Already using httpOnly cookies
2. **Always validate input** - Backend validates all requests
3. **Use HTTPS in production** - Currently using HTTP for development
4. **Implement audit logging** - Track all admin actions
5. **Set appropriate CORS origins** - Currently allows localhost

---

## Testing

### cURL Examples

Get all users:
```bash
curl -X GET http://localhost:4000/api/admin/users \
  -H "Cookie: token=your_jwt_token" \
  -H "Content-Type: application/json"
```

Change role:
```bash
curl -X PUT http://localhost:4000/api/admin/users/USER_ID/role \
  -H "Cookie: token=your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

Delete user:
```bash
curl -X DELETE http://localhost:4000/api/admin/users/USER_ID \
  -H "Cookie: token=your_jwt_token"
```

---

## Backend Structure

```javascript
// adminController.js
export const getAllUsers = async (req, res) => { }
export const getUserDetails = async (req, res) => { }
export const getAdminStats = async (req, res) => { }
export const deleteUser = async (req, res) => { }
export const changeUserRole = async (req, res) => { }
export const getAdminInfo = async (req, res) => { }

// authMiddleware.js
export const protect = async (req, res, next) => { }
export const adminOnly = (req, res, next) => { }

// Both must pass for admin endpoints
```

---

## Response Time Expectations

- GET /users - ~50-200ms
- GET /stats - ~30-100ms
- PUT /users/:id/role - ~50-150ms
- DELETE /users/:id - ~50-150ms

(Times vary with database size and server load)

---

**For more details, see ADMIN_PANEL_SETUP.md**
