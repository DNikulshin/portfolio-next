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
    return <Loader />;
  }

  if (isErrorUser) {
    return (
      <div className="h-screen flex justify-center items-center text-red-500 font-bold text-center">
        {(error as Error).message}
      </div>
    );
  }

  if (isLogout) {
    return <Loader />;
  }

  return (
    <div>
      <AdminHeader
        isLogout={isLogout}
        logoutHandler={logoutHandler}
        userFromSessionEmail={userFromSession?.userEmail}
      />
      <CreateForm userId={userFromSession?.userId ?? ""} />
      <div className="px-2 py-2">
        <h3 className="text-center">
          Admin Page - {userFromSession?.userEmail}
        </h3>

        <WorkList type="list" />
      </div>
    </div>
  );
}
