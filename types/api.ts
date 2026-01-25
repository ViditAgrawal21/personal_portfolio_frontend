// API Response Types
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

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApiError {
  message: string;
  error?: string;
  details?: Record<string, unknown>;
}

// Form Data Types
export interface ServiceInquiryFormData {
  clientName: string;
  email: string;
  serviceType: string;
  budgetRange?: string;
  requirements: string;
}

export interface HireRequestFormData {
  projectName: string;
  techStack: string[];
  email: string;
  message: string;
}

export interface UpdateStatusPayload {
  status: InquiryStatus | HireStatus;
  internalNotes?: string;
}
