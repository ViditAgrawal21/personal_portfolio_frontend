// Admin API helper functions for content management
import { getApiBaseUrl } from '@/config/api';

const API_BASE = getApiBaseUrl();

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// ABOUT API
export const aboutAPI = {
  get: () => apiRequest<any>('/api/content/about'),
  update: (data: any) => apiRequest('/api/admin/content/about', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// SERVICES API
export const servicesAPI = {
  getAll: () => apiRequest<any[]>('/api/content/services'),
  getById: (id: string) => apiRequest(`/api/admin/content/services/${id}`),
  create: (data: any) => apiRequest('/api/admin/content/services', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/api/admin/content/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/api/admin/content/services/${id}`, {
    method: 'DELETE',
  }),
};

// PROJECTS API
export const projectsAPI = {
  getAll: () => apiRequest<any[]>('/api/content/projects'),
  getById: (id: string) => apiRequest(`/api/admin/content/projects/${id}`),
  create: (data: any) => apiRequest('/api/admin/content/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/api/admin/content/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/api/admin/content/projects/${id}`, {
    method: 'DELETE',
  }),
};

// TECH STACK API
export const techStackAPI = {
  getAll: () => apiRequest<any[]>('/api/content/stack'),
  getById: (id: string) => apiRequest(`/api/admin/content/stack/${id}`),
  create: (data: any) => apiRequest('/api/admin/content/stack', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/api/admin/content/stack/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/api/admin/content/stack/${id}`, {
    method: 'DELETE',
  }),
};

// EXPERIENCE API
export const experienceAPI = {
  getAll: () => apiRequest<any[]>('/api/content/experience'),
  getById: (id: string) => apiRequest(`/api/admin/content/experience/${id}`),
  create: (data: any) => apiRequest('/api/admin/content/experience', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/api/admin/content/experience/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/api/admin/content/experience/${id}`, {
    method: 'DELETE',
  }),
};

// EDUCATION API
export const educationAPI = {
  getAll: () => apiRequest<any[]>('/api/content/education'),
  getById: (id: string) => apiRequest(`/api/admin/content/education/${id}`),
  create: (data: any) => apiRequest('/api/admin/content/education', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/api/admin/content/education/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/api/admin/content/education/${id}`, {
    method: 'DELETE',
  }),
};

// IMAGE UPLOAD API
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE}/api/admin/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Upload failed');
  }

  return data.data.url;
};
