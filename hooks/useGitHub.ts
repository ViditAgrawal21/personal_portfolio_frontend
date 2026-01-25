'use client';

import { useState, useEffect } from 'react';
import { fetchGitHubRepos, convertGitHubRepoToProject, type GitHubRepo } from '@/lib/github';
import type { Project } from '@/types/portfolio';

/**
 * Hook to fetch projects from GitHub
 */
export function useGitHubProjects(username?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const repos = await fetchGitHubRepos(username);
        
        // Convert repos to project format
        const projectData = repos.map((repo, idx) => 
          convertGitHubRepoToProject(repo, idx < 3) // Mark first 3 as featured
        );
        
        setProjects(projectData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub projects');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return { projects, loading, error };
}

/**
 * Hook to merge backend projects with GitHub projects
 */
export function useMergedProjects(backendProjects: Project[], githubUsername?: string) {
  const { projects: githubProjects, loading: githubLoading } = useGitHubProjects(githubUsername);
  const [mergedProjects, setMergedProjects] = useState<Project[]>(backendProjects);

  useEffect(() => {
    if (!githubLoading && githubUsername) {
      // Filter out GitHub projects that already exist in backend
      const backendGithubUrls = new Set(
        backendProjects.map(p => p.githubUrl).filter(Boolean)
      );
      
      const uniqueGithubProjects = githubProjects.filter(
        p => !backendGithubUrls.has(p.githubUrl)
      );
      
      // Merge: backend projects first, then unique GitHub projects
      setMergedProjects([...backendProjects, ...uniqueGithubProjects]);
    } else {
      setMergedProjects(backendProjects);
    }
  }, [backendProjects, githubProjects, githubLoading, githubUsername]);

  return mergedProjects;
}
