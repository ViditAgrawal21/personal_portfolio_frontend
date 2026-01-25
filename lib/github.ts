// GitHub API integration for fetching repositories

const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  private: boolean;
}

/**
 * Fetch all public repositories for a GitHub user
 */
export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();
    
    // Filter out archived and private repos
    return repos.filter(repo => !repo.archived && !repo.private);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

/**
 * Fetch a specific repository
 */
export async function fetchGitHubRepo(owner: string, repo: string): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
        next: { revalidate: 3600 }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub repo:', error);
    return null;
  }
}

/**
 * Extract GitHub owner and repo from URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace('.git', '')
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Convert GitHub repo to Project format
 */
export function convertGitHubRepoToProject(repo: GitHubRepo, featured: boolean = false) {
  return {
    _id: `github-${repo.id}`,
    title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: repo.description || 'No description available',
    technologies: repo.topics.length > 0 ? repo.topics : [repo.language || 'Unknown'],
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || undefined,
    image: undefined,
    category: categorizeByLanguage(repo.language),
    status: 'completed' as const,
    featured: featured,
    startDate: repo.created_at,
    endDate: repo.updated_at,
    highlights: [],
  };
}

/**
 * Categorize project based on primary language
 */
function categorizeByLanguage(language: string | null): string {
  if (!language) return 'Other';
  
  const categories: Record<string, string> = {
    'TypeScript': 'Web Development',
    'JavaScript': 'Web Development',
    'Python': 'AI/ML',
    'Java': 'Backend',
    'Kotlin': 'Mobile',
    'Swift': 'Mobile',
    'Rust': 'Systems',
    'Go': 'Backend',
    'C++': 'Systems',
    'C#': 'Desktop',
  };
  
  return categories[language] || 'Other';
}
