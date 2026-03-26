// Admin API helper functions for content management
import { getApiBaseUrl } from '@/config/api';

const API_BASE = getApiBaseUrl();

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Authentication helper functions
export const authHelpers = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  },
  
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('adminToken', token);
    sessionStorage.setItem('adminToken', token);
  },
  
  clearToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminRole');
  },
  
  isAuthenticated: (): boolean => {
    return !!authHelpers.getToken();
  }
};

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const token = authHelpers.getToken();
    
    // Debug logging for authentication
    console.log('🔐 Admin API Request:', {
      endpoint,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 10)}...` : 'null'
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No authentication token found for admin request to:', endpoint);
      throw new Error('Authentication required. Please log in again.');
    }

    // Add cache busting to admin requests
    const separator = endpoint.includes('?') ? '&' : '?';
    const cacheBuster = `_t=${Date.now()}&_r=${Math.random()}`;
    const fullEndpoint = `${endpoint}${separator}${cacheBuster}`;

    const response = await fetch(`${API_BASE}${fullEndpoint}`, {
      ...options,
      headers,
      cache: 'no-store',
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error('Invalid response from server');
    }
    
    if (!response.ok) {
      console.error('❌ API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data,
        endpoint: fullEndpoint
      });
      
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        console.error('❌ Authentication failed - clearing tokens');
        authHelpers.clearToken();
        // Redirect to login if we're on an admin page
        if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
          window.location.href = '/admin/login';
        }
        throw new Error('Authentication failed. Please log in again.');
      }
      
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }

    console.log('✅ Admin API Success:', endpoint);
    return data;
  } catch (error) {
    console.error('💥 Admin API Request Failed:', {
      endpoint,
      error: error instanceof Error ? error.message : error,
      hasToken: authHelpers.isAuthenticated()
    });
    throw error;
  }
}

// ABOUT API
export const aboutAPI = {
  get: () => apiRequest<any>('/content/about'),
  update: (data: any) => apiRequest('/admin/content/about', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  // The backend has no separate availability endpoint — availability fields
  // are part of the main about document. Merge them into PUT /admin/content/about.
  updateAvailability: (data: { isAvailable: boolean; availabilityStatus?: string; hourlyRate?: string; [key: string]: any }) =>
    apiRequest('/admin/content/about', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// SERVICES API
export const servicesAPI = {
  getAll: () => apiRequest<any[]>('/content/services'),
  getById: (id: string) => apiRequest(`/admin/content/services/${id}`),
  create: (data: any) => apiRequest('/admin/content/services', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/admin/content/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/admin/content/services/${id}`, {
    method: 'DELETE',
  }),
};

// PROJECTS API
export const projectsAPI = {
  getAll: () => apiRequest<any[]>('/content/projects'),
  getById: (id: string) => apiRequest(`/admin/content/projects/${id}`),
  create: (data: any) => apiRequest('/admin/content/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/admin/content/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/admin/content/projects/${id}`, {
    method: 'DELETE',
  }),
};

// TECH STACK API
export const techStackAPI = {
  getAll: () => apiRequest<any[]>('/content/stack'),
  getById: (id: string) => apiRequest(`/admin/content/stack/${id}`),
  create: (data: any) => apiRequest('/admin/content/stack', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/admin/content/stack/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/admin/content/stack/${id}`, {
    method: 'DELETE',
  }),
};

// EXPERIENCE API
export const experienceAPI = {
  getAll: () => apiRequest<any[]>('/content/experience'),
  getById: (id: string) => apiRequest(`/admin/content/experience/${id}`),
  create: (data: any) => apiRequest('/admin/content/experience', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/admin/content/experience/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/admin/content/experience/${id}`, {
    method: 'DELETE',
  }),
};

// EDUCATION API
export const educationAPI = {
  getAll: () => apiRequest<any[]>('/content/education'),
  getById: (id: string) => apiRequest(`/admin/content/education/${id}`),
  create: (data: any) => apiRequest('/admin/content/education', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/admin/content/education/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/admin/content/education/${id}`, {
    method: 'DELETE',
  }),
};

// IMAGE UPLOAD API
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Upload failed');
  }

  return data.data.url;
};
