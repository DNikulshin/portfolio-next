import Link from "next/link";
import { FaUserAlt } from "react-icons/fa";

interface Props {
  userFromSessionEmail: string | undefined;
  isLogout: boolean;
  logoutHandler: () => void;
}

export const AdminHeader = ({
  isLogout,
  logoutHandler,
  userFromSessionEmail,
}: Props) => {
  return (
    <header className="flex justify-between items-center px-3 py-4 shadow-sm shadow-amber-100 mb-3 flex-wrap gap-2 sticky top-0 z-30 bg-slate-800/90">
      <div className=" container mx-auto">
        <div className="flex gap-2  justify-center items-center w-full mb-2">
          <span className="text-xl">
            <FaUserAlt />{" "}
          </span>
          <span className="text-ellipsis overflow-hidden">
            {userFromSessionEmail}
          </span>
          <Link href={"/"}>На главную</Link>
        </div>

        <div className="flex justify-between gap-3 items-center w-full">
          <button
            className="bg-red-500 px-3 py-1.5 rounded-sm cursor-pointer disabled:bg-gray-400 shadow-sm shadow-red-500/50"
            disabled={isLogout}
            onClick={logoutHandler}
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
};
