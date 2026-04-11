"use client";

import { Task, Priority, TaskStatus } from "@prisma/client";
import { MdDelete, MdDragIndicator } from "react-icons/md";

const priorityStyles: Record<Priority, string> = {
  LOW: "text-blue-400",
  MEDIUM: "text-yellow-400",
  HIGH: "text-red-400",
};

const priorityLabel: Record<Priority, string> = {
  LOW: "Низкий",
  MEDIUM: "Средний",
  HIGH: "Высокий",
};

const nextStatus: Record<TaskStatus, TaskStatus | null> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: null,
};

const nextStatusLabel: Record<TaskStatus, string> = {
  TODO: "→ В работу",
  IN_PROGRESS: "→ Готово",
  DONE: "Готово",
};

interface Props {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onStatusChange, onDelete }: Props) {
  const next = nextStatus[task.status];

  return (
    <div className="bg-background border border-border rounded-lg p-3 space-y-2 group">
      <div className="flex items-start gap-2">
        <MdDragIndicator className="text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground flex-1">{task.title}</p>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
          title="Удалить"
        >
          <MdDelete className="text-base" />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground pl-6">{task.description}</p>
      )}

      <div className="flex items-center justify-between pl-6">
        <span className={`text-xs font-medium ${priorityStyles[task.priority]}`}>
          {priorityLabel[task.priority]}
        </span>
        {next && (
          <button
            onClick={() => onStatusChange(task.id, next)}
            className="text-xs text-primary hover:underline"
          >
            {nextStatusLabel[task.status]}
          </button>
        )}
      </div>
    </div>
  );
}
