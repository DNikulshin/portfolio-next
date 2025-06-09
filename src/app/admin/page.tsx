"use client";
import { useUser } from "@/hooks/useUser";
import React, { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { logout } from "@/shared/lib/actions";
import { Loader } from "@/components/Loader";
import { CreateForm } from "@/components/admin/CreateForm";
import { WorkList } from "@/components/works/WorkList";

export default function Admin() {
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

  if (isLogout) {
    return <Loader type="h-screen" />;
  }

  return (
    <div className="flex flex-col h-screen gap-2">
      <AdminHeader
        isLogout={isLogout}
        logoutHandler={logoutHandler}
        userFromSessionEmail={userFromSession?.userEmail}
      />
      <div className="px-2 pb-4">
        <CreateForm userId={userFromSession?.userId ?? ""} />
        <h3 className="text-center">
          Admin Page - {userFromSession?.userEmail}
        </h3>

        <WorkList type="list" />
      </div>
    </div>
  );
}
