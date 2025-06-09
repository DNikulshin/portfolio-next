import React from "react";

export const Loader = ({ type }: { type: "h-screen" | "h-full" }) => {
  return (
    <div
      className={`flex ${type} min-h-[200px] justify-center items-center text-blue-500 font-bold text-center`}
    >
      <div className="loader"></div>
    </div>
  );
};
