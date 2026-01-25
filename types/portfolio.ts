// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// About
export interface About {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

// Service
export interface Service {
  _id: string;
  name: string;
  description: string;
  category?: string;
  icon?: string;
  features?: string[];
  deliverables?: string[];
  pricing?: {
    type: string;
    amount: string;
  };
  timeline?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Project
export interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  category?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  startDate?: string;
  endDate?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Tech Stack
export interface TechStack {
  _id: string;
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
  _id: string;
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
  _id: string;
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
