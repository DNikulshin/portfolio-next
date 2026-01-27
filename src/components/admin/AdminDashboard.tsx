'use client';

import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { logout } from "@/shared/lib/actions";
import { Loader } from "@/components/Loader";
import { CreateForm } from "@/components/admin/CreateForm";

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

  if (!userFromSession) {
    return <Loader type="h-screen" />;
  }

  return (
    <>
      <AdminHeader
        user={userFromSession}
        isLogout={isLogout}
        logout={logoutHandler}
      />
      <CreateForm userId={userFromSession?.userId} />
    </>
  );
}
