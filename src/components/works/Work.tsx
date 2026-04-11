'use client';

import { Work } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

export const WorkItem = (work: Work) => {
  return (
    <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-xl overflow-hidden">
      <div className="flex flex-col md:flex-row items-start gap-4 p-4">
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
      </div>
    </div>
  );
};
