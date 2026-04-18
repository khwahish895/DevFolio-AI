import { GithubRepo } from "../types";

const BASE_URL = "https://api.github.com";

export async function fetchUserRepos(username: string): Promise<GithubRepo[]> {
  const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=100`);
  if (!response.ok) throw new Error("Failed to fetch repos");
  return response.json();
}

export async function fetchRepoReadme(username: string, repoName: string): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/repos/${username}/${repoName}/readme`, {
      headers: { Accept: "application/vnd.github.v3.raw" },
    });
    if (!response.ok) return "";
    return response.text();
  } catch {
    return "";
  }
}

export async function fetchUserStats(username: string) {
  const response = await fetch(`${BASE_URL}/users/${username}`);
  if (!response.ok) return null;
  return response.json();
}
