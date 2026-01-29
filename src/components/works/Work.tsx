'use client';

import { Work } from '@prisma/client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDeleteWork } from '@/hooks/useWork';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { UpdateForm } from '@/components/admin/UpdateForm';

export const WorkItem = (work: Work) => {
  const [isEditing, setIsEditing] = useState(false);
  const deleteWork = useDeleteWork();

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-xl overflow-hidden">
      
      {/* Основной контент: изображение + информация */}
      <div className="flex flex-col md:flex-row items-start gap-4 p-4">
        
        {/* Изображение */}
        <div className="w-full md:w-48 flex-shrink-0">
          <Image
            src={work.imageUrl}
            alt={work.title}
            width={400}
            height={400}
            className="w-full h-auto object-cover rounded-md border-2 border-gray-600"
            priority
          />
        </div>

        {/* Контейнер для текста и кнопок */}
        <div className="flex flex-col md:flex-row justify-between w-full gap-4">
          
          {/* Блок с текстом */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-amber-50">{work.title}</h3>
            <Link
              href={work.linkUrl}
              className="text-blue-400 hover:underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {work.linkUrl}
            </Link>
          </div>

          {/* Кнопки управления */}
          <div className="flex items-start gap-4 self-end md:self-start flex-shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-700 hover:bg-green-700 rounded-md transition-colors duration-200"
            >
              <FaEdit />
              <span>{isEditing ? 'Закрыть' : 'Изменить'}</span>
            </button>
            <button
              onClick={() => deleteWork.mutate(work.id)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-700 hover:bg-red-700 rounded-md transition-colors duration-200"
              disabled={deleteWork.isPending}
            >
              <MdDelete />
              <span>{deleteWork.isPending ? 'Удаление...' : 'Удалить'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Форма обновления */}
      {isEditing && <UpdateForm work={work} onClose={() => setIsEditing(false)} />}
    </div>
  );
};
