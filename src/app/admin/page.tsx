"use client";

import { useUser } from "@/hooks/useUser";
import { useGetWorkList } from "@/hooks/useWork";
import React, { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { logout } from "@/shared/lib/actions";
import Link from "next/link";
import Image from "next/image";
import { Loader } from "@/components/Loader";
import { CreateForm } from "@/components/admin/CreateForm";

export default function Admin() {
  const {
    data: userFromSession,
    isFetching: isFetchingUser,
    isError: isErrorUser,
  } = useUser();
  const {
    data,
    isError: isErrorList,
    error,
    isFetching: isFetchingList,
  } = useGetWorkList();
  const [isLogout, setIsLogout] = useState(false);

  const logoutHandler = async () => {
    setIsLogout(true);
    await logout();
    setIsLogout(false);
  };

  if (isFetchingUser && isFetchingList) {
    return <Loader />;
  }

  if (isErrorList && isErrorUser) {
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

        <div className="flex flex-col gap-4 px-4 py-4">
          {data?.works &&
            data?.works.map((work) => (
              <div
                key={work.id}
                className="flex gap-2 justify-between items-center shadow-sm shadow-amber-100 px-4 py-4"
              >
                <div>{work.title}</div>
                <Image
                  src={work.imagePath}
                  alt={work.title}
                  width={200}
                  height={200}
                  priority
                  className="h-auto"
                />
                <Link
                  href={work.linkPath}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View project
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
