'use client';

import { useState, useEffect } from 'react';
import type { PortfolioContent, Project, Service, TechStack, Experience, Education, About } from '@/types/portfolio';
import { 
  getAllContent, 
  getProjects, 
  getServices, 
  getTechStack, 
  getExperience, 
  getEducation,
  getAbout
} from '@/lib/api';

// Caching disabled - always fetch fresh data
const CACHE_DURATION = 0; // No caching
// Cache version for cleanup
const CACHE_VERSION = 'v3';
const CACHE_KEY = `portfolio_cache_${CACHE_VERSION}`;

interface CacheData {
  data: PortfolioContent;
  timestamp: number;
}

// Main hook to fetch all portfolio content
export function usePortfolio() {
  const [data, setData] = useState<PortfolioContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Clear any existing cache on every load
        if (typeof window !== 'undefined') {
          // Clear all portfolio-related cache
          Object.keys(localStorage).forEach(key => {
            if (key.includes('portfolio_cache')) {
              localStorage.removeItem(key);
            }
          });
        }

        // Always fetch fresh data with cache busting
        const portfolioData = await getAllContent();
        setData(portfolioData);
        
        // No caching - always fetch fresh data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

// Hook for projects with filtering
export function useProjects(params?: { featured?: boolean; category?: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProjects(params);
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.featured, params?.category]);

  return { projects, loading, error };
}

// Hook for services
export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { services, loading, error };
}

// Hook for tech stack
export function useTechStack(category?: string) {
  const [techStack, setTechStack] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTechStack(category);
        setTechStack(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tech stack');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  return { techStack, loading, error };
}

// Hook for experience
export function useExperience() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getExperience();
        setExperience(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch experience');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { experience, loading, error };
}

// Hook for education
export function useEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getEducation();
        setEducation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch education');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { education, loading, error };
}

// Hook for about section
export function useAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAbout();
        setAbout(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch about data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { about, loading, error };
}

// Clear cache utility — purges current version key + any old version keys
export function clearPortfolioCache() {
  if (typeof window !== 'undefined') {
    Object.keys(localStorage)
      .filter(k => k.startsWith('portfolio_cache'))
      .forEach(k => localStorage.removeItem(k));
  }
}
