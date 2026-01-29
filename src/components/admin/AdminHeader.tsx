'use client';

import { IUserData } from "@/types/types";
import { Button } from "@/shared/ui/kit/button";
import { useRunSeed } from "@/hooks/useWork";
import Link from "next/link";

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
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <h1 className="text-xl font-bold">Админ-панель</h1>
          <Link href="/" passHref>
            <Button variant="outline" size="sm">
              На главную
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4">
          {user && <span className="text-sm order-first sm:order-none w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">{user.email}</span>}

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
