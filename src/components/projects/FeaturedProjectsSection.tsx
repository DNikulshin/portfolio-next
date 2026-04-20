import { getFeaturedRepos } from '@/shared/lib/github'
import { ProjectCard } from './ProjectCard'

export async function FeaturedProjectsSection() {
  const repos = await getFeaturedRepos(process.env.GITHUB_TOKEN)

  return (
    <div className="py-20">
      <span className="font-mono text-primary text-xs tracking-widest uppercase">// 03 projects</span>
      <h2 className="text-3xl font-bold mt-2 mb-10">Избранные проекты</h2>

      {repos.length === 0 ? (
        <p className="text-muted-foreground font-mono text-sm">
          Не удалось загрузить проекты с GitHub.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map(repo => (
            <ProjectCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  )
}
