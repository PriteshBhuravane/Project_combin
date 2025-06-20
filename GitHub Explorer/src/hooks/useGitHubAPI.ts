import { useState, useEffect } from "react";
import { Repository } from "./types"; // Import from your shared types file

interface GitHubAPIHook {
  repositories: Repository[];
  trending: Repository[];
  loading: boolean;
  error: string | null;
  searchRepositories: (query: string, language?: string, sortBy?: string) => Promise<void>;
  fetchTrending: () => Promise<void>;
}

export const useGitHubAPI = (): GitHubAPIHook => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [trending, setTrending] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildSearchQuery = (
    query: string,
    language: string = "all",
    sortBy: string = "stars"
  ): URLSearchParams => {
    let searchQuery = query.trim();
    
    if (language !== "all") {
      searchQuery += ` language:${language}`;
    }
    
    // Add minimum star count for better quality results
    searchQuery += " stars:>10";
    
    const sortMap: Record<string, string> = {
      stars: "stars",
      forks: "forks",
      updated: "updated",
      created: "created",
    };
    
    const params = new URLSearchParams({
      q: searchQuery,
      sort: sortMap[sortBy] || "stars",
      order: "desc",
      per_page: "30",
    });
    
    return params;
  };

  const searchRepositories = async (
    query: string,
    language: string = "all",
    sortBy: string = "stars"
  ): Promise<void> => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = buildSearchQuery(query, language, sortBy);
      const response = await fetch(`https://api.github.com/search/repositories?${params}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      setRepositories(data.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error fetching repositories:", errorMessage);
      setError(errorMessage);
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const dateString = lastWeek.toISOString().split('T')[0];
      
      const response = await fetch(
        `https://api.github.com/search/repositories?q=created:>${dateString}&sort=stars&order=desc&per_page=10`
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      setTrending(data.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error fetching trending repositories:", errorMessage);
      setError(errorMessage);
      setTrending([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  return {
    repositories,
    trending,
    loading,
    error,
    searchRepositories,
    fetchTrending,
  };
};