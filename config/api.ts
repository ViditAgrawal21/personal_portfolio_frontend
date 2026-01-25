// API Configuration
export const getApiBaseUrl = () => {
  // Always use production proxy to avoid CORS
  return '/api/proxy';
};

export const API_BASE_URL = getApiBaseUrl();

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
    INQUIRIES_BY_ID: (id: string) => `/api/admin/inquiries/${id}`,
    INQUIRIES_REPLY: (id: string) => `/api/admin/inquiries/${id}/reply`,
    INQUIRIES_PDF: (id: string) => `/api/admin/inquiries/${id}/pdf`,
    UPDATE_INQUIRY_STATUS: (id: string) => `/api/admin/inquiry/${id}/status`,
    HIRE_REQUESTS: '/api/admin/hire-requests',
    HIRE_REQUESTS_EXPORT: '/api/admin/hire-requests/export/csv',
    HIRE_REQUESTS_BY_ID: (id: string) => `/api/admin/hire-requests/${id}`,
    HIRE_REQUESTS_REPLY: (id: string) => `/api/admin/hire-requests/${id}/reply`,
    HIRE_REQUESTS_PDF: (id: string) => `/api/admin/hire-requests/${id}/pdf`,
    UPDATE_HIRE_STATUS: (id: string) => `/api/admin/hire-request/${id}/status`,
    UPLOAD: '/api/admin/upload',
    STATS: '/api/admin/stats',
  },
};

// Full API endpoints with base URL
export const API_ENDPOINTS = {
  // Authentication
  login: `${API_BASE_URL}${API_ROUTES.ADMIN.LOGIN}`,
  
  // Hire Requests
  hireRequests: `${API_BASE_URL}${API_ROUTES.ADMIN.HIRE_REQUESTS}`,
  hireRequestReply: (id: string) => `${API_BASE_URL}${API_ROUTES.ADMIN.HIRE_REQUESTS_REPLY(id)}`,
  hireRequestPdf: (id: string) => `${API_BASE_URL}${API_ROUTES.ADMIN.HIRE_REQUESTS_PDF(id)}`,
  hireRequestsExport: `${API_BASE_URL}${API_ROUTES.ADMIN.HIRE_REQUESTS_EXPORT}`,
  
  // Service Inquiries
  inquiries: `${API_BASE_URL}${API_ROUTES.ADMIN.INQUIRIES}`,
  inquiryReply: (id: string) => `${API_BASE_URL}${API_ROUTES.ADMIN.INQUIRIES_REPLY(id)}`,
  inquiryPdf: (id: string) => `${API_BASE_URL}${API_ROUTES.ADMIN.INQUIRIES_PDF(id)}`,
  inquiriesExport: `${API_BASE_URL}${API_ROUTES.ADMIN.INQUIRIES_EXPORT}`,
  
  // File Upload
  upload: `${API_BASE_URL}${API_ROUTES.ADMIN.UPLOAD}`,
  
  // Stats
  stats: `${API_BASE_URL}${API_ROUTES.ADMIN.STATS}`,
};

export const API_CONFIG = {
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};
