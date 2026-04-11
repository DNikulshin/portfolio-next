"use client";

import { useState } from "react";
import { Work } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useDeleteWork } from "@/hooks/useWork";
import { WorkForm } from "./WorkForm";
import { FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export function WorkItem({ work }: { work: Work }) {
  const [isEditing, setIsEditing] = useState(false);
  const deleteWork = useDeleteWork();

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-start gap-4 p-4">
        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-background border border-border">
          <Image
            src={work.imageUrl}
            alt={work.title}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{work.title}</p>
          <Link
            href={work.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
          >
            <FaExternalLinkAlt className="flex-shrink-0" />
            <span className="truncate">{work.linkUrl}</span>
          </Link>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="Редактировать"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => deleteWork.mutate(work.id)}
            disabled={deleteWork.isPending}
            className="p-2 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Удалить"
          >
            <MdDelete />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="border-t border-border">
          <WorkForm work={work} onClose={() => setIsEditing(false)} />
        </div>
      )}
    </div>
  );
}
