export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

export interface PortfolioConfig {
  githubUsername: string;
  displayName: string;
  bio: string;
  tagline: string;
  themeId: string;
  colors: {
    primary: string;
    background: string;
    text: string;
  };
  projects: PortfolioProject[];
  stats: {
    totalStars: number;
    topLanguages: string[];
  };
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  techStack: string[];
  isHighlighted: boolean;
}

export type ThemeType = 'minimal' | 'dark' | 'glassmorphism' | 'brutalist';
