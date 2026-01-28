'use client';

import { IUserData } from "@/types/types";
import { Button } from "@/shared/ui/kit/button";
import { useRunSeed } from "@/hooks/useWork";
import Link from "next/link"; // Импортируем Link

interface AdminHeaderProps {
  user: IUserData | null;
  isLogout: boolean;
  logout: () => void;
}

export const AdminHeader = ({ user, isLogout, logout }: AdminHeaderProps) => {
  const runSeedMutation = useRunSeed();

  const handleRunSeed = () => {
    if (
      window.confirm(
        "Вы уверены, что хотите сбросить базу данных и выйти из системы? Это действие необратимо.",
      )
    ) {
      runSeedMutation.mutate();
    }
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6"> {/* Обертка для заголовка и ссылки */} 
          <h1 className="text-xl font-bold">Админ-панель</h1>
          <Link href="/" passHref>
            <Button variant="outline" size="sm"> 
              На главную
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm">{user.email}</span>}

          <Button
            onClick={handleRunSeed}
            disabled={runSeedMutation.isPending}
            variant="destructive"
            size="sm"
          >
            {runSeedMutation.isPending ? "Сброс..." : "Сбросить БД"}
          </Button>

          <Button onClick={logout} disabled={isLogout} variant="outline" size="sm">
            {isLogout ? "Выход..." : "Выход"}
          </Button>
        </div>
      </div>
    </header>
  );
};
