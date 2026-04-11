import { auth } from "@/auth";
import { getGithubUser, getGithubRepos } from "@/shared/lib/github";
import { FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt } from "react-icons/fa";
import { MdPeople, MdPerson } from "react-icons/md";

export default async function GithubPage() {
  const session = await auth();
  const token = session?.accessToken;

  if (!token) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        GitHub токен недоступен. Переавторизуйтесь.
      </div>
    );
  }

  const [user, repos] = await Promise.all([
    getGithubUser(token),
    getGithubRepos(token),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">GitHub</h1>

      {/* User card */}
      <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-20 h-20 rounded-full border-2 border-border"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{user.name ?? user.login}</h2>
            <a href={user.html_url} target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <FaExternalLinkAlt className="text-sm" />
            </a>
          </div>
          {user.bio && <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>}
          <div className="flex items-center gap-6 mt-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <FaGithub />
              <span>{user.public_repos} репо</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MdPeople />
              <span>{user.followers} подписчиков</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MdPerson />
              <span>{user.following} подписок</span>
            </div>
          </div>
        </div>
      </div>

      {/* Repos */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Последние репозитории</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                  {repo.name}
                </span>
                <FaExternalLinkAlt className="text-xs text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>

              {repo.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {repo.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-3">
                {repo.language && (
                  <span className="text-xs text-muted-foreground">{repo.language}</span>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FaStar className="text-yellow-400" />
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FaCodeBranch />
                  {repo.forks_count}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
