import { auth } from "@/auth";
import { prismaClient } from "@/shared/lib/prisma-client";
import Link from "next/link";
import { MdWork, MdFolderOpen, MdCheckCircle, MdPending } from "react-icons/md";
import { FaGithub } from "react-icons/fa";

async function getStats() {
  const [worksCount, projectsCount, tasksInProgress, tasksDone] = await Promise.all([
    prismaClient.work.count(),
    prismaClient.project.count({ where: { status: "ACTIVE" } }),
    prismaClient.task.count({ where: { status: "IN_PROGRESS" } }),
    prismaClient.task.count({ where: { status: "DONE" } }),
  ]);
  return { worksCount, projectsCount, tasksInProgress, tasksDone };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getStats();

  const cards = [
    {
      label: "Работ в портфолио",
      value: stats.worksCount,
      icon: MdWork,
      href: "/dashboard/works",
      color: "text-blue-400",
    },
    {
      label: "Активных проектов",
      value: stats.projectsCount,
      icon: MdFolderOpen,
      href: "/dashboard/projects",
      color: "text-green-400",
    },
    {
      label: "Задач в работе",
      value: stats.tasksInProgress,
      icon: MdPending,
      href: "/dashboard/projects",
      color: "text-yellow-400",
    },
    {
      label: "Задач завершено",
      value: stats.tasksDone,
      icon: MdCheckCircle,
      href: "/dashboard/projects",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Привет, {session?.user?.name?.split(" ")[0] ?? "Дмитрий"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Обзор вашего дашборда</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors group"
          >
            <Icon className={`text-3xl ${color} mb-3`} />
            <p className="text-2xl font-bold group-hover:text-primary transition-colors">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-base font-semibold mb-3 text-muted-foreground">Быстрый переход</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/dashboard/works"
            className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 hover:border-primary transition-colors">
            <MdWork className="text-xl text-blue-400" />
            <span className="text-sm">Управление работами</span>
          </Link>
          <Link href="/dashboard/projects"
            className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 hover:border-primary transition-colors">
            <MdFolderOpen className="text-xl text-green-400" />
            <span className="text-sm">Kanban-доска</span>
          </Link>
          <Link href="/dashboard/github"
            className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 hover:border-primary transition-colors">
            <FaGithub className="text-xl" />
            <span className="text-sm">GitHub статистика</span>
          </Link>
        </div>
      </div>

      {/* Back to portfolio */}
      <div className="pt-4 border-t border-border">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Вернуться на сайт
        </Link>
      </div>
    </div>
  );
}
