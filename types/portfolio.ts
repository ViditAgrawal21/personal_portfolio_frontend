// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// About
export interface About {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  profileImageUrl?: string;
  yearsOfExp?: number;
  isAvailable?: boolean;
  availabilityStatus?: string;
  hourlyRate?: string;
  createdAt: string;
  updatedAt: string;
}

// Service
export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features?: string[];
  pricing?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Project
export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  category?: string;
  isFeatured: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Tech Stack
export interface TechStack {
  id: string;
  name: string;
  category: string;
  icon?: string;
  proficiency: number;
  description?: string;
  yearsOfExperience?: number;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Experience
export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
  companyUrl?: string;
  techUsed?: string[];
  displayOrder: number;
}

// Education
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  location?: string;
  description?: string;
  displayOrder: number;
}

// All Content
export interface PortfolioContent {
  about: About | null;
  services: Service[];
  projects: Project[];
  techStack: TechStack[];
  experience: Experience[];
  education: Education[];
}
