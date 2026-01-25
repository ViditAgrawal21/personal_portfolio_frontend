# Backend API Requirements

This document lists all the backend API endpoints required for the Portfolio Admin System to function properly.

## Base URL
```
http://localhost:5000
```

## 1. Authentication APIs

### POST `/api/admin/login`
**Purpose:** Admin login
**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "admin@example.com",
    "role": "SUPER_ADMIN",
    "token": "jwt_token_here"
  }
}
```

---

## 2. Content Management APIs

### About

#### GET `/api/content/about`
**Purpose:** Get about information (PUBLIC)
**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "about_id",
    "fullName": "John Doe",
    "title": "Full Stack Developer",
    "bio": "Passionate developer...",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "githubUrl": "https://github.com/johndoe",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "twitterUrl": "https://twitter.com/johndoe",
    "profileImageUrl": "/assests/profile_photo.png"
  }
}
```

#### PUT `/api/admin/content/about`
**Purpose:** Update about information (ADMIN)
**Request Body:**
```json
{
  "fullName": "John Doe",
  "title": "Full Stack Developer",
  "bio": "Updated bio...",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "githubUrl": "https://github.com/johndoe",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "twitterUrl": "https://twitter.com/johndoe"
}
```

---

### Services

#### GET `/api/content/services`
**Purpose:** Get all services (PUBLIC)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "service_id",
      "name": "Web Development",
      "icon": "💻",
      "description": "Custom web applications...",
      "features": ["React", "Node.js", "MongoDB"],
      "pricing": "$5000 - $10000",
      "featured": true
    }
  ]
}
```

#### POST `/api/admin/content/services`
**Purpose:** Create new service (ADMIN)

#### PUT `/api/admin/content/services/:id`
**Purpose:** Update service (ADMIN)

#### DELETE `/api/admin/content/services/:id`
**Purpose:** Delete service (ADMIN)

---

### Projects

#### GET `/api/content/projects`
**Purpose:** Get all projects (PUBLIC)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "project_id",
      "title": "E-commerce Platform",
      "description": "Full-featured online store...",
      "technologies": ["React", "Node.js", "MongoDB"],
      "category": "Web Development",
      "status": "completed",
      "githubUrl": "https://github.com/user/project",
      "liveUrl": "https://project.com",
      "image": "/assests/projects/ecommerce.png",
      "featured": true
    }
  ]
}
```

#### POST `/api/admin/content/projects`
**Purpose:** Create new project (ADMIN)

#### PUT `/api/admin/content/projects/:id`
**Purpose:** Update project (ADMIN)

#### DELETE `/api/admin/content/projects/:id`
**Purpose:** Delete project (ADMIN)

---

### Tech Stack

#### GET `/api/content/stack`
**Purpose:** Get all technologies (PUBLIC)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "tech_id",
      "name": "React",
      "category": "Frontend",
      "proficiency": 90,
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      "featured": true
    }
  ]
}
```

#### POST `/api/admin/content/stack`
**Purpose:** Create new technology (ADMIN)

#### PUT `/api/admin/content/stack/:id`
**Purpose:** Update technology (ADMIN)

#### DELETE `/api/admin/content/stack/:id`
**Purpose:** Delete technology (ADMIN)

---

### Experience

#### GET `/api/content/experience`
**Purpose:** Get all work experience (PUBLIC)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "exp_id",
      "company": "Tech Corp",
      "position": "Senior Developer",
      "location": "San Francisco, CA",
      "startDate": "2020-01-15",
      "endDate": "2023-12-31",
      "current": false,
      "description": "Led development of..."
    }
  ]
}
```

#### POST `/api/admin/content/experience`
**Purpose:** Create new experience (ADMIN)

#### PUT `/api/admin/content/experience/:id`
**Purpose:** Update experience (ADMIN)

#### DELETE `/api/admin/content/experience/:id`
**Purpose:** Delete experience (ADMIN)

---

### Education

#### GET `/api/content/education`
**Purpose:** Get all education records (PUBLIC)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "edu_id",
      "institution": "Stanford University",
      "degree": "Bachelor's",
      "field": "Computer Science",
      "startDate": "2015-09-01",
      "endDate": "2019-06-15",
      "gpa": "3.8/4.0"
    }
  ]
}
```

#### POST `/api/admin/content/education`
**Purpose:** Create new education record (ADMIN)

#### PUT `/api/admin/content/education/:id`
**Purpose:** Update education record (ADMIN)

#### DELETE `/api/admin/content/education/:id`
**Purpose:** Delete education record (ADMIN)

---

## 3. Inquiries APIs

### GET `/api/admin/inquiries`
**Purpose:** Get all service inquiries with pagination (ADMIN)
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string, optional): Filter by status (NEW, IN_PROGRESS, CONTACTED, CONVERTED, REJECTED)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "inquiry_id",
      "clientName": "Jane Smith",
      "email": "jane@company.com",
      "serviceType": "Web Development",
      "budgetRange": "$5k-$10k",
      "requirements": "Need a modern e-commerce website...",
      "status": "NEW",
      "internalNotes": "High priority client",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### GET `/api/admin/inquiries/:id`
**Purpose:** Get single inquiry details (ADMIN)
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "inquiry_id",
    "clientName": "Jane Smith",
    "email": "jane@company.com",
    "serviceType": "Web Development",
    "budgetRange": "$5k-$10k",
    "requirements": "Need a modern e-commerce website...",
    "status": "NEW",
    "internalNotes": "High priority client",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

### PATCH `/api/admin/inquiry/:id/status`
**Purpose:** Update inquiry status (ADMIN)
**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "internalNotes": "Contacted via email"
}
```

### GET `/api/admin/inquiries/export/csv`
**Purpose:** Export inquiries to CSV (ADMIN)
**Query Parameters:**
- `status` (string, optional): Filter by status

**Response:** CSV file download
```csv
ID,Client Name,Email,Service Type,Budget Range,Status,Requirements,Created At,Updated At
inquiry_1,Jane Smith,jane@company.com,Web Development,$5k-$10k,NEW,"Need website...",2024-01-20,2024-01-20
```

### POST `/api/services/inquiry`
**Purpose:** Submit new inquiry from public portfolio (PUBLIC)
**Request Body:**
```json
{
  "clientName": "Jane Smith",
  "email": "jane@company.com",
  "serviceType": "Web Development",
  "budgetRange": "$5k-$10k",
  "requirements": "Need a modern e-commerce website..."
}
```

---

## 4. Hire Requests APIs

### GET `/api/admin/hire-requests`
**Purpose:** Get all hire requests with pagination (ADMIN)
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "request_id",
      "projectName": "Blockchain Wallet",
      "techStack": ["Solidity", "Web3.js", "React", "Hardhat"],
      "email": "startup@company.com",
      "message": "Looking for blockchain developer...",
      "status": "NEW",
      "internalNotes": "",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 23,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

### GET `/api/admin/hire-requests/:id`
**Purpose:** Get single hire request details (ADMIN)

### PATCH `/api/admin/hire-request/:id/status`
**Purpose:** Update hire request status (ADMIN)
**Request Body:**
```json
{
  "status": "REVIEWING",
  "internalNotes": "Scheduled interview"
}
```

### POST `/api/hire/request`
**Purpose:** Submit new hire request from public portfolio (PUBLIC)
**Request Body:**
```json
{
  "projectName": "Blockchain Wallet",
  "techStack": ["Solidity", "Web3.js", "React"],
  "email": "startup@company.com",
  "message": "Looking for blockchain developer..."
}
```

---

## 5. Statistics API

### GET `/api/admin/stats`
**Purpose:** Get dashboard statistics (ADMIN)
**Response:**
```json
{
  "success": true,
  "data": {
    "inquiries": {
      "total": 145,
      "byStatus": {
        "NEW": 23,
        "IN_PROGRESS": 12,
        "CONTACTED": 8,
        "CONVERTED": 45,
        "REJECTED": 57
      },
      "thisMonth": 18
    },
    "hireRequests": {
      "total": 67,
      "byStatus": {
        "NEW": 12,
        "REVIEWING": 8,
        "ACCEPTED": 23,
        "DECLINED": 24
      },
      "thisMonth": 9
    }
  }
}
```

---

## 6. File Upload API

### POST `/api/admin/upload`
**Purpose:** Upload images (ADMIN)
**Request:** multipart/form-data with file field
**Response:**
```json
{
  "success": true,
  "data": {
    "url": "/assests/projects/uploaded-image-1234.png"
  }
}
```

---

## 7. Batch Content API (Optional Optimization)

### GET `/api/content/all`
**Purpose:** Get all content in single request (PUBLIC)
**Response:**
```json
{
  "success": true,
  "data": {
    "about": { /* about data */ },
    "services": [ /* services array */ ],
    "projects": [ /* projects array */ ],
    "techStack": [ /* tech stack array */ ],
    "experience": [ /* experience array */ ],
    "education": [ /* education array */ ]
  }
}
```

---

## Important Notes

### Authentication
All `/api/admin/*` endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Status Enums
**Inquiry Statuses:** NEW | IN_PROGRESS | CONTACTED | CONVERTED | REJECTED
**Hire Request Statuses:** NEW | REVIEWING | ACCEPTED | DECLINED

### Error Responses
All endpoints should return consistent error format:
```json
{
  "success": false,
  "error": "Error message here",
  "message": "User-friendly message"
}
```

### Pagination
All paginated endpoints should return data in the format shown above with `data` and `pagination` fields.

### CORS
Backend must allow CORS from `http://localhost:3000` (or your frontend URL) for development.

---

## Testing Checklist

- [ ] Admin can login and receive JWT token
- [ ] Token persists in localStorage
- [ ] All content CRUD operations work
- [ ] Inquiries pagination works
- [ ] Hire requests pagination works
- [ ] Status updates work for both inquiries and hire requests
- [ ] Stats API returns accurate counts
- [ ] CSV export works for inquiries
- [ ] File upload works for project images
- [ ] Public APIs work without authentication
- [ ] Admin APIs reject requests without token
- [ ] Error handling returns proper status codes

---

## Frontend Implementation Status

✅ **Completed:**
- Admin authentication with persistence
- All 6 content management pages (About, Services, Projects, Tech Stack, Experience, Education)
- Inquiries page with view details modal and PDF download
- Hire Requests page with view details modal, PDF download, and CSV export
- Real-time stats display on both pages
- Admin dashboard with statistics
- Public portfolio pages

✅ **API Integration:**
- All hooks created (useInquiries, useHireRequests, useStats, useAbout, useServices, etc.)
- API client configured
- Error handling implemented
- Loading states handled

**Next Steps:**
1. Ensure backend implements all endpoints listed above
2. Test all CRUD operations
3. Verify authentication flow
4. Test file uploads
5. Confirm stats are calculated correctly
