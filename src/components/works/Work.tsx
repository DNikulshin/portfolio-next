import { Work } from "@prisma/client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDeleteWork } from "@/hooks/useWork";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

export const WorkItem = (work: Work) => {
  const deleteWork = useDeleteWork();
  return (
    <div className="flex gap-2 justify-between items-center shadow-sm shadow-amber-100 px-4 py-4">
      <div>{work.title}</div>
      <div className="max-w-[200px]">
        <Image
          src={work.imageUrl}
          alt={work.title}
          width={200}
          height={200}
          className="h-auto"
          priority
        />
      </div>

      <div className="flex items-center justify-center gap-4">
        <Link
          href={work.linkUrl}
          className="text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View project
        </Link>
        <button
          onClick={() => deleteWork.mutate(work.id)}
          className="text-red-500 text-2xl cursor-pointer"
        >
          <MdDelete />
        </button>
        <button
          onClick={() => {}}
          className="text-red-500 text-2xl cursor-pointer"
        >
          <FaEdit />
        </button>
      </div>
    </div>
  );
};
