import {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaVuejs,
  FaNodeJs, FaDocker,
} from 'react-icons/fa'
import {
  SiTypescript, SiNextdotjs, SiNuxtdotjs,
  SiNestjs, SiFastify, SiPrisma, SiPostgresql, SiRedis,
  SiExpo, SiGithubactions, SiCloudflare,
} from 'react-icons/si'
import { TbAtom } from 'react-icons/tb'
import { SkillGrid, type Skill } from './SkillGrid'

const frontend: Skill[] = [
  { icon: <FaHtml5 className="text-orange-500" />, label: 'HTML5' },
  { icon: <FaCss3Alt className="text-blue-500" />, label: 'CSS3' },
  { icon: <FaJs className="text-yellow-400" />, label: 'JavaScript' },
  { icon: <SiTypescript className="text-blue-400" />, label: 'TypeScript' },
  { icon: <FaReact className="text-cyan-400" />, label: 'React' },
  { icon: <SiNextdotjs />, label: 'Next.js' },
  { icon: <FaVuejs className="text-green-500" />, label: 'Vue.js' },
  { icon: <SiNuxtdotjs className="text-green-400" />, label: 'Nuxt.js' },
  { icon: <TbAtom className="text-violet-400" />, label: 'Zustand' },
]

const backend: Skill[] = [
  { icon: <FaNodeJs className="text-green-600" />, label: 'Node.js' },
  { icon: <SiNestjs className="text-red-500" />, label: 'NestJS' },
  { icon: <SiFastify />, label: 'Fastify' },
  { icon: <SiPrisma className="text-slate-300" />, label: 'Prisma' },
  { icon: <SiPostgresql className="text-blue-400" />, label: 'PostgreSQL' },
  { icon: <SiRedis className="text-red-500" />, label: 'Redis' },
]

const mobile: Skill[] = [
  { icon: <FaReact className="text-cyan-300" />, label: 'React Native' },
  { icon: <SiExpo />, label: 'Expo' },
]

const infra: Skill[] = [
  { icon: <FaDocker className="text-blue-500" />, label: 'Docker' },
  { icon: <SiGithubactions className="text-slate-300" />, label: 'GitHub Actions' },
  { icon: <SiCloudflare className="text-orange-400" />, label: 'Cloudflare' },
]

const categories = [
  { id: 'frontend', label: 'Frontend', skills: frontend },
  { id: 'backend', label: 'Backend', skills: backend },
  { id: 'mobile', label: 'Mobile', skills: mobile },
  { id: 'infra', label: 'Infra & DevOps', skills: infra },
]

export function SkillsSection() {
  return (
    <div className="py-12">
      <span className="font-mono text-primary text-xs tracking-widest uppercase">// 02 skills</span>
      <h2 className="text-3xl font-bold mt-2 mb-8">Технологии</h2>

      <div className="space-y-6">
        {categories.map(({ id, label, skills }) => (
          <div key={id}>
            <p className="font-mono text-xs text-muted-foreground mb-4 border-b border-border pb-1.5">
              {label}
            </p>
            <SkillGrid skills={skills} />
          </div>
        ))}
      </div>
    </div>
  )
}
