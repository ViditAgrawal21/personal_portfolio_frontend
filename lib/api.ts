import type { 
  ApiResponse, 
  PortfolioContent, 
  About, 
  Service, 
  Project, 
  TechStack, 
  Experience, 
  Education 
} from '@/types/portfolio';
import { getApiBaseUrl } from '@/config/api';

// Get API base URL for production
export const API_BASE = getApiBaseUrl();

// Generic API fetch helper with error handling
async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache revalidation for Next.js
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<T> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }
    
    return result.data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Get all portfolio content (recommended for initial load)
export async function getAllContent(): Promise<PortfolioContent> {
  return fetchAPI<PortfolioContent>('/content/all');
}

// Get about section
export async function getAbout(): Promise<About | null> {
  return fetchAPI<About | null>('/content/about');
}

// Get services
export async function getServices(): Promise<Service[]> {
  return fetchAPI<Service[]>('/content/services');
}

// Get projects
export async function getProjects(params?: {
  featured?: boolean;
  category?: string;
}): Promise<Project[]> {
  const searchParams = new URLSearchParams();
  if (params?.featured !== undefined) {
    searchParams.append('featured', String(params.featured));
  }
  if (params?.category) {
    searchParams.append('category', params.category);
  }
  
  const query = searchParams.toString();
  const endpoint = `/content/projects${query ? `?${query}` : ''}`;
  
  return fetchAPI<Project[]>(endpoint);
}

// Get tech stack
export async function getTechStack(category?: string): Promise<TechStack[]> {
  const endpoint = category 
    ? `/content/stack?category=${encodeURIComponent(category)}`
    : '/content/stack';
  return fetchAPI<TechStack[]>(endpoint);
}

// Get experience
export async function getExperience(): Promise<Experience[]> {
  return fetchAPI<Experience[]>('/content/experience');
}

// Get education
export async function getEducation(): Promise<Education[]> {
  return fetchAPI<Education[]>('/content/education');
}

// Utility functions
export function formatDate(dateString: string, format: 'short' | 'long' = 'short'): string {
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateRange(
  startDate: string, 
  endDate?: string, 
  isCurrent?: boolean
): string {
  const start = formatDate(startDate);
  const end = isCurrent ? 'Present' : (endDate ? formatDate(endDate) : 'Present');
  return `${start} - ${end}`;
}

// Group tech stack by category
export function groupTechByCategory(techStack: TechStack[]): Record<string, TechStack[]> {
  return techStack.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, TechStack[]>);
}
