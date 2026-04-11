"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { MdDashboard, MdWork, MdFolderOpen, MdLogout } from "react-icons/md";
import { FaGithub } from "react-icons/fa";

const navItems = [
  { href: "/dashboard", label: "Обзор", icon: MdDashboard },
  { href: "/dashboard/works", label: "Работы", icon: MdWork },
  { href: "/dashboard/projects", label: "Проекты", icon: MdFolderOpen },
  { href: "/dashboard/github", label: "GitHub", icon: FaGithub },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-card border-r border-border flex flex-col z-10">
      <div className="px-6 py-5 border-b border-border">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Dashboard
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="text-lg flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <MdLogout className="text-lg flex-shrink-0" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
