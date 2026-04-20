import Link from 'next/link'
import { FaGithub, FaStar, FaCodeBranch } from 'react-icons/fa'
import type { GithubRepo } from '@/shared/lib/github'
import { PROJECT_TECH } from './projectsData'

interface Props {
  repo: GithubRepo
}

export function ProjectCard({ repo }: Props) {
  const techTags = PROJECT_TECH[repo.name] ?? (repo.language ? [repo.language] : [])

  return (
    <div
      className="flex flex-col h-full bg-card border border-border rounded-xl p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
      style={{ boxShadow: 'var(--card-glow)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <FaGithub className="text-muted-foreground flex-shrink-0" />
          <span className="font-mono text-sm font-semibold text-foreground truncate">
            {repo.name}
          </span>
        </div>
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary font-mono flex-shrink-0 hover:underline"
        >
          GitHub →
        </Link>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed flex-grow mb-4 line-clamp-3">
        {repo.description ?? 'Нет описания'}
      </p>

      {/* Tech tags */}
      {techTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {techTags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs font-mono rounded-md bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 pt-3 border-t border-border">
        {repo.language && (
          <span className="text-xs text-muted-foreground font-mono">{repo.language}</span>
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
    </div>
  )
}
