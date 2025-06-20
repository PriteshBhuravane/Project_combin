export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  size: number;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}