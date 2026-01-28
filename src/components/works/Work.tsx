'use client';

import { Work } from "@prisma/client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDeleteWork } from "@/hooks/useWork";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { UpdateForm } from "@/components/admin/UpdateForm";

export const WorkItem = (work: Work) => {
  const [isEditing, setIsEditing] = useState(false);
  const deleteWork = useDeleteWork();

  return (
    <div className="shadow-sm shadow-amber-100 px-4 py-4 rounded-lg">
      <div className="flex gap-2 justify-between items-center">
        <div>{work.title}</div>
        
        {/* ИЗМЕНЕНО: Возвращаем гибкий контейнер */}
        <div className="max-w-[200px] flex-shrink-0">
          <Image
            src={work.imageUrl}
            alt={work.title}
            width={400}  // Увеличено для лучшего качества на retina-дисплеях
            height={400} // Увеличено для лучшего качества на retina-дисплеях
            className="w-full h-auto rounded-md" // w-full и h-auto для сохранения пропорций
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
            className="text-red-500 text-2xl cursor-pointer disabled:opacity-50"
            disabled={deleteWork.isPending}
          >
            <MdDelete />
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)} // Переключаем режим редактирования
            className="text-green-500 text-2xl cursor-pointer"
          >
            <FaEdit />
          </button>
        </div>
      </div>
      {/* Условный рендеринг формы обновления */}
      {isEditing && <UpdateForm work={work} onClose={() => setIsEditing(false)} />}
    </div>
  );
};
