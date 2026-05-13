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
  if (!res.ok)
    throw new Error("Не удалось получить данные GitHub пользователя");
  return res.json();
}

const FEATURED_REPO_NAMES = [
  "docbrain",
  "scan-agent",
  "ai-automation-starter",
  "corporate-transport",
  "support-ticketing-system",
  "pc-remote",
  " AnyWhereDesk",
  "chrome-ext-todo",
];

export async function getFeaturedRepos(token?: string): Promise<GithubRepo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const results = await Promise.allSettled(
    FEATURED_REPO_NAMES.map((name) =>
      fetch(`https://api.github.com/repos/DNikulshin/${name}`, {
        headers,
        next: { revalidate: 3600 },
      }).then((r) => (r.ok ? (r.json() as Promise<GithubRepo>) : null)),
    ),
  );
  return results
    .filter(
      (r): r is PromiseFulfilledResult<GithubRepo> =>
        r.status === "fulfilled" && r.value !== null,
    )
    .map((r) => r.value);
}

export async function getGithubRepos(
  accessToken: string,
): Promise<GithubRepo[]> {
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
