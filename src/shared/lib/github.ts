export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  private: boolean;
}

export interface GithubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export async function getGithubUser(accessToken: string): Promise<GithubUser> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Не удалось получить данные GitHub пользователя");
  return res.json();
}

export async function getGithubRepos(accessToken: string): Promise<GithubRepo[]> {
  const res = await fetch(
    "https://api.github.com/user/repos?sort=updated&per_page=20&type=owner",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 300 },
    },
  );
  if (!res.ok) throw new Error("Не удалось получить репозитории");
  return res.json();
}
