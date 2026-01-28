'use client';

import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { logout } from "@/shared/lib/actions";
import { Loader } from "@/components/Loader";
import { CreateForm } from "@/components/admin/CreateForm";
import { WorkList } from "@/components/works/WorkList";

export function AdminDashboard() {
  const [isLogout, setIsLogout] = useState(false);

  const {
    data: userFromSession,
    isFetching: isFetchingUser,
    isError: isErrorUser,
    error,
  } = useUser();

  const logoutHandler = async () => {
    setIsLogout(true);
    await logout();
    setIsLogout(false);
  };

  // Пока идет проверка пользователя, показываем один полноэкранный лоадер
  if (isFetchingUser) {
    return <Loader type="h-screen" />;
  }

  if (isErrorUser) {
    return (
      <div className="h-screen flex justify-center items-center text-red-500 font-bold text-center">
        {(error as Error).message}
      </div>
    );
  }

  // Если пользователь не авторизован, можно показать форму входа или перенаправить
  // Сейчас просто показываем лоадер, чтобы избежать мелькания контента
  if (!userFromSession) {
    return <Loader type="h-screen" />;
  }

  // Когда пользователь подтвержден, рендерим весь контент админки
  return (
    <>
      <AdminHeader
        user={userFromSession}
        isLogout={isLogout}
        logout={logoutHandler}
      />
      <main className="container mx-auto px-4">
        <section className="py-8 border-b border-dashed">
          <h2 className="text-2xl font-bold mb-4 text-center">Добавить новую работу</h2>
          <CreateForm userId={userFromSession?.userId} />
        </section>

        {/* WorkList теперь здесь, он начнет загрузку только после рендера этой секции */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Список работ</h2>
          <WorkList type="list" />
        </section>
      </main>
    </>
  );
}
