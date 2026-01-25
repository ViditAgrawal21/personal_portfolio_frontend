    # React Frontend - API Integration Guide

    Complete guide for React developers to integrate with the portfolio backend APIs.

    ## Base Configuration

    ```typescript
    // src/config/api.ts
    export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    export const API_ROUTES = {
    // Public APIs
    PUBLIC: {
        SERVICE_INQUIRY: '/api/services/inquiry',
        HIRE_REQUEST: '/api/hire/request',
    },
    // Admin APIs
    ADMIN: {
        LOGIN: '/api/admin/login',
        INQUIRIES: '/api/admin/inquiries',
        INQUIRIES_EXPORT: '/api/admin/inquiries/export/csv',
        INQUIRIES_BY_ID: '/api/admin/inquiries/:id',
        UPDATE_INQUIRY_STATUS: '/api/admin/inquiry/:id/status',
        HIRE_REQUESTS: '/api/admin/hire-requests',
        HIRE_REQUESTS_BY_ID: '/api/admin/hire-requests/:id',
        UPDATE_HIRE_STATUS: '/api/admin/hire-request/:id/status',
        STATS: '/api/admin/stats',
    },
    };
    ```

    ---

    ## Public APIs (No Authentication Required)

    ### 1. Submit Service Inquiry

    **Endpoint:** `POST /api/services/inquiry`

    **Request Body:**
    ```typescript
    interface ServiceInquiry {
    clientName: string;        // min 2, max 100 chars
    email: string;             // valid email format
    serviceType: string;       // 'Web Development' | 'Mobile Dev' | 'Consulting' | 'Other'
    budgetRange?: string;      // optional budget info
    requirements: string;      // min 10, max 2000 chars
    }
    ```

    **Response (201):**
    ```typescript
    {
    id: "uuid",
    clientName: "John Doe",
    email: "john@example.com",
    serviceType: "Web Development",
    budgetRange: "$5000-$10000",
    requirements: "Build a React dashboard...",
    status: "NEW",
    createdAt: "2026-01-24T10:30:00Z"
    }
    ```

    **Error Responses:**
    - `400`: Validation error (missing/invalid fields)
    - `429`: Rate limited (max 10 requests per 15 minutes)
    - `500`: Server error

    **React Hook Example:**
    ```typescript
    // src/hooks/useServiceInquiry.ts
    import { useState } from 'react';
    import { API_BASE_URL, API_ROUTES } from '../config/api';

    interface InquiryFormData {
    clientName: string;
    email: string;
    serviceType: string;
    budgetRange?: string;
    requirements: string;
    }

    export const useServiceInquiry = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const submitInquiry = async (data: InquiryFormData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.PUBLIC.SERVICE_INQUIRY}`,
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit inquiry');
        }

        const result = await response.json();
        setSuccess(true);
        return result;
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        throw err;
        } finally {
        setLoading(false);
        }
    };

    return { submitInquiry, loading, error, success };
    };
    ```

    ---

    ### 2. Submit Hire Request

    **Endpoint:** `POST /api/hire/request`

    **Request Body:**
    ```typescript
    interface HireRequest {
    projectName: string;       // min 3, max 150 chars
    techStack: string[];       // array of tech names, min 1
    email: string;             // valid email format
    message: string;           // min 10, max 2000 chars
    }
    ```

    **Response (201):**
    ```typescript
    {
    id: "uuid",
    projectName: "E-commerce Platform",
    techStack: ["React", "Node.js", "PostgreSQL"],
    email: "client@example.com",
    message: "Looking for experienced full-stack developer...",
    status: "NEW",
    createdAt: "2026-01-24T10:30:00Z"
    }
    ```

    **React Hook Example:**
    ```typescript
    // src/hooks/useHireRequest.ts
    import { useState } from 'react';
    import { API_BASE_URL, API_ROUTES } from '../config/api';

    interface HireRequestData {
    projectName: string;
    techStack: string[];
    email: string;
    message: string;
    }

    export const useHireRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitHireRequest = async (data: HireRequestData) => {
        setLoading(true);
        setError(null);

        try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.PUBLIC.HIRE_REQUEST}`,
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit hire request');
        }

        return await response.json();
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        throw err;
        } finally {
        setLoading(false);
        }
    };

    return { submitHireRequest, loading, error };
    };
    ```

    ---

    ## Admin APIs (Authentication Required)

    ### Authentication

    All admin endpoints require a valid JWT token in the Authorization header:

    ```typescript
    const token = localStorage.getItem('adminToken');
    const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    };
    ```

    ---

    ### 3. Admin Login

    **Endpoint:** `POST /api/admin/login`

    **Request Body:**
    ```typescript
    {
    email: "admin@portfolio.com",
    password: "your-password"
    }
    ```

    **Response (200):**
    ```typescript
    {
    id: "uuid",
    email: "admin@portfolio.com",
    role: "SUPER_ADMIN",
    token: "eyJhbGciOiJIUzI1NiIs..." // JWT Token (expires in 1 hour)
    }
    ```

    **React Hook Example:**
    ```typescript
    // src/hooks/useAdminAuth.ts
    import { useState } from 'react';
    import { API_BASE_URL, API_ROUTES } from '../config/api';

    export const useAdminAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [admin, setAdmin] = useState(null);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.ADMIN.LOGIN}`,
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', data.email);
        localStorage.setItem('adminRole', data.role);
        setAdmin(data);
        return data;
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        throw err;
        } finally {
        setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminRole');
        setAdmin(null);
    };

    return { login, logout, loading, error, admin };
    };
    ```

    ---

    ### 4. Get All Service Inquiries

    **Endpoint:** `GET /api/admin/inquiries?page=1&limit=10&status=NEW`

    **Query Parameters:**
    - `page` (optional): Page number, default 1
    - `limit` (optional): Items per page, default 10
    - `status` (optional): Filter by status (NEW, IN_PROGRESS, CONTACTED, CONVERTED, REJECTED)

    **Response (200):**
    ```typescript
    {
    data: [
        {
        id: "uuid",
        clientName: "John Doe",
        email: "john@example.com",
        serviceType: "Web Development",
        budgetRange: "$5000-$10000",
        requirements: "Build a React dashboard...",
        status: "NEW",
        internalNotes: "Follow up next week",
        createdAt: "2026-01-24T10:30:00Z",
        updatedAt: "2026-01-24T10:30:00Z"
        }
    ],
    pagination: {
        total: 25,
        page: 1,
        limit: 10,
        pages: 3
    }
    }
    ```

    **React Hook Example:**
    ```typescript
    // src/hooks/useInquiries.ts
    import { useState, useEffect } from 'react';
    import { API_BASE_URL, API_ROUTES } from '../config/api';

    export const useInquiries = (page = 1, limit = 10, status?: string) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInquiries = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams({ page: String(page), limit: String(limit) });
            if (status) params.append('status', status);

            const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.ADMIN.INQUIRIES}?${params}`,
            {
                headers: {
                'Authorization': `Bearer ${token}`,
                },
            }
            );

            if (!response.ok) {
            throw new Error('Failed to fetch inquiries');
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
        };

        fetchInquiries();
    }, [page, limit, status]);

    return { data, loading, error };
    };
    ```

    ---

    ### 5. Get Single Inquiry

    **Endpoint:** `GET /api/admin/inquiries/:id`

    **Response (200):**
    ```typescript
    {
    id: "uuid",
    clientName: "John Doe",
    email: "john@example.com",
    serviceType: "Web Development",
    budgetRange: "$5000-$10000",
    requirements: "Build a React dashboard...",
    status: "NEW",
    internalNotes: "Follow up next week",
    createdAt: "2026-01-24T10:30:00Z",
    updatedAt: "2026-01-24T10:30:00Z"
    }
    ```

    ---

    ### 6. Update Inquiry Status

    **Endpoint:** `PATCH /api/admin/inquiry/:id/status`

    **Request Body:**
    ```typescript
    {
    status: "IN_PROGRESS",
    internalNotes: "Started working on proposal"
    }
    ```

    **Status Values:** `NEW` | `IN_PROGRESS` | `CONTACTED` | `CONVERTED` | `REJECTED`

    **Response (200):**
    ```typescript
    {
    id: "uuid",
    status: "IN_PROGRESS",
    internalNotes: "Started working on proposal",
    updatedAt: "2026-01-24T11:00:00Z"
    }
    ```

    **React Hook Example:**
    ```typescript
    // src/hooks/useUpdateInquiry.ts
    import { useState } from 'react';
    import { API_BASE_URL, API_ROUTES } from '../config/api';

    export const useUpdateInquiry = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateStatus = async (id: string, status: string, internalNotes?: string) => {
        setLoading(true);
        setError(null);

        try {
        const token = localStorage.getItem('adminToken');
        const url = `${API_BASE_URL}${API_ROUTES.ADMIN.UPDATE_INQUIRY_STATUS}`.replace(':id', id);

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status, internalNotes }),
        });

        if (!response.ok) {
            throw new Error('Failed to update inquiry');
        }

        return await response.json();
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        throw err;
        } finally {
        setLoading(false);
        }
    };

    return { updateStatus, loading, error };
    };
    ```

    ---

    ### 7. Export Inquiries as CSV

    **Endpoint:** `GET /api/admin/inquiries/export/csv`

    **Query Parameters:**
    - `status` (optional): Filter by status

    **Response:** CSV file download

    ```typescript
    // Download CSV file
    const downloadInquiriesCSV = async (status?: string) => {
    const token = localStorage.getItem('adminToken');
    const params = new URLSearchParams();
    if (status) params.append('status', status);

    const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.ADMIN.INQUIRIES_EXPORT}?${params}`,
        {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    };
    ```

    ---

    ### 8. Get All Hire Requests

    **Endpoint:** `GET /api/admin/hire-requests?page=1&limit=10`

    **Response (200):**
    ```typescript
    {
    data: [
        {
        id: "uuid",
        projectName: "E-commerce Platform",
        techStack: ["React", "Node.js", "PostgreSQL"],
        email: "client@example.com",
        message: "Looking for experienced full-stack developer...",
        status: "NEW",
        internalNotes: "Premium client, high priority",
        createdAt: "2026-01-24T10:30:00Z",
        updatedAt: "2026-01-24T10:30:00Z"
        }
    ],
    pagination: { total: 15, page: 1, limit: 10, pages: 2 }
    }
    ```

    ---

    ### 9. Get Single Hire Request

    **Endpoint:** `GET /api/admin/hire-requests/:id`

    ---

    ### 10. Update Hire Request Status

    **Endpoint:** `PATCH /api/admin/hire-request/:id/status`

    **Request Body:**
    ```typescript
    {
    status: "ACCEPTED",
    internalNotes: "Client approved, contract sent"
    }
    ```

    **Status Values:** `NEW` | `REVIEWING` | `ACCEPTED` | `DECLINED`

    ---

    ### 11. Get Statistics

    **Endpoint:** `GET /api/admin/stats`

    **Response (200):**
    ```typescript
    {
    inquiries: {
        total: 25,
        byStatus: {
        NEW: 5,
        IN_PROGRESS: 3,
        CONTACTED: 8,
        CONVERTED: 6,
        REJECTED: 3
        },
        thisMonth: 12
    },
    hireRequests: {
        total: 15,
        byStatus: {
        NEW: 4,
        REVIEWING: 2,
        ACCEPTED: 7,
        DECLINED: 2
        },
        thisMonth: 8
    }
    }
    ```

    **React Hook Example:**
    ```typescript
    // src/hooks/useStats.ts
    import { useState, useEffect } from 'react';
    import { API_BASE_URL, API_ROUTES } from '../config/api';

    export const useStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.ADMIN.STATS}`,
            {
                headers: {
                'Authorization': `Bearer ${token}`,
                },
            }
            );

            if (!response.ok) throw new Error('Failed to fetch stats');
            setStats(await response.json());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
    };
    ```

    ---

    ## Error Handling

    All responses follow this format:

    **Success (2xx):**
    ```typescript
    {
    message: "Success",
    data: { /* response data */ }
    }
    ```

    **Error (4xx/5xx):**
    ```typescript
    {
    message: "Error description",
    error: "ERROR_CODE",
    details?: { /* additional details */ }
    }
    ```

    **Common HTTP Status Codes:**
    - `200`: Success
    - `201`: Created
    - `400`: Bad Request (validation error)
    - `401`: Unauthorized (missing/invalid token)
    - `403`: Forbidden (insufficient permissions)
    - `404`: Not Found
    - `429`: Too Many Requests (rate limited)
    - `500`: Server Error

    ---

    ## TypeScript Types

    ```typescript
    // src/types/api.ts
    export interface ServiceInquiry {
    id: string;
    clientName: string;
    email: string;
    serviceType: string;
    budgetRange?: string;
    requirements: string;
    status: InquiryStatus;
    internalNotes?: string;
    createdAt: string;
    updatedAt: string;
    }

    export interface HireRequest {
    id: string;
    projectName: string;
    techStack: string[];
    email: string;
    message: string;
    status: HireStatus;
    internalNotes?: string;
    createdAt: string;
    updatedAt: string;
    }

    export type InquiryStatus = 'NEW' | 'IN_PROGRESS' | 'CONTACTED' | 'CONVERTED' | 'REJECTED';
    export type HireStatus = 'NEW' | 'REVIEWING' | 'ACCEPTED' | 'DECLINED';

    export interface AdminUser {
    id: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER';
    token: string;
    }

    export interface StatsResponse {
    inquiries: {
        total: number;
        byStatus: Record<InquiryStatus, number>;
        thisMonth: number;
    };
    hireRequests: {
        total: number;
        byStatus: Record<HireStatus, number>;
        thisMonth: number;
    };
    }
    ```

    ---

    ## Environment Variables (.env.local)

    ```env
    REACT_APP_API_URL=http://localhost:5000
    REACT_APP_ENV=development
    ```

    For production:
    ```env
    REACT_APP_API_URL=https://your-production-api.com
    REACT_APP_ENV=production
    ```

    ---

    ## Complete Example: Service Inquiry Form Component

    ```typescript
    // src/components/ServiceInquiryForm.tsx
    import React, { useState } from 'react';
    import { useServiceInquiry } from '../hooks/useServiceInquiry';

    export const ServiceInquiryForm: React.FC = () => {
    const { submitInquiry, loading, error, success } = useServiceInquiry();
    const [formData, setFormData] = useState({
        clientName: '',
        email: '',
        serviceType: 'Web Development',
        budgetRange: '',
        requirements: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await submitInquiry(formData);
        setFormData({
            clientName: '',
            email: '',
            serviceType: 'Web Development',
            budgetRange: '',
            requirements: '',
        });
        alert('Inquiry submitted successfully!');
        } catch (err) {
        console.error('Submission failed:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Your Name"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            required
        />

        <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
        />

        <select
            value={formData.serviceType}
            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
        >
            <option>Web Development</option>
            <option>Mobile Dev</option>
            <option>Consulting</option>
            <option>Other</option>
        </select>

        <input
            type="text"
            placeholder="Budget Range (optional)"
            value={formData.budgetRange}
            onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
        />

        <textarea
            placeholder="Tell us about your project requirements..."
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            required
        />

        <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Inquiry'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Inquiry submitted successfully!</p>}
        </form>
    );
    };
    ```

    ---

    ## Next Steps

    1. Create React project: `npx create-react-app portfolio-frontend` or `npm create vite@latest`
    2. Install dependencies: `npm install react-router-dom axios`
    3. Set up environment variables in `.env.local`
    4. Create API configuration and hooks
    5. Build admin dashboard and public inquiry pages
    6. Implement authentication flow
    7. Add state management (Context API, Redux, or Zustand)
    8. Deploy frontend alongside backend

