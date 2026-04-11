"use client";

import { useState } from "react";
import { Project, Task, TaskStatus, ProjectStatus } from "@prisma/client";
import { TaskCard } from "./TaskCard";
import { MdDelete, MdAdd, MdExpandMore, MdExpandLess } from "react-icons/md";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

type ProjectWithTasks = Project & { tasks: Task[] };

const statusStyles: Record<ProjectStatus, string> = {
  ACTIVE: "bg-green-500/20 text-green-400",
  PAUSED: "bg-yellow-500/20 text-yellow-400",
  COMPLETED: "bg-blue-500/20 text-blue-400",
  ARCHIVED: "bg-gray-500/20 text-gray-400",
};

const statusLabel: Record<ProjectStatus, string> = {
  ACTIVE: "Активный",
  PAUSED: "Пауза",
  COMPLETED: "Завершён",
  ARCHIVED: "Архив",
};

const columns: { status: TaskStatus; label: string }[] = [
  { status: "TODO", label: "К выполнению" },
  { status: "IN_PROGRESS", label: "В работе" },
  { status: "DONE", label: "Готово" },
];

interface Props {
  project: ProjectWithTasks;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ProjectStatus) => void;
  onTaskStatusChange: (taskId: string, status: TaskStatus) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: (projectId: string, title: string, priority: string) => void;
}

export function ProjectCard({
  project,
  onDelete,
  onStatusChange,
  onTaskStatusChange,
  onTaskDelete,
  onAddTask,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM");
  const [addingTask, setAddingTask] = useState(false);

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(project.id, newTaskTitle.trim(), newTaskPriority);
    setNewTaskTitle("");
    setAddingTask(false);
  }

  const allStatuses: ProjectStatus[] = ["ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? <MdExpandLess className="text-xl" /> : <MdExpandMore className="text-xl" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">{project.title}</h3>
            <select
              value={project.status}
              onChange={(e) => onStatusChange(project.id, e.target.value as ProjectStatus)}
              className={`text-xs px-2 py-0.5 rounded-full border-0 outline-none cursor-pointer ${statusStyles[project.status]}`}
            >
              {allStatuses.map((s) => (
                <option key={s} value={s} className="bg-card text-foreground">
                  {statusLabel[s]}
                </option>
              ))}
            </select>
          </div>
          {project.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{project.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <FaGithub />
            </a>
          )}
          {project.deployUrl && (
            <a href={project.deployUrl} target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <FaExternalLinkAlt className="text-sm" />
            </a>
          )}
          <button
            onClick={() => setAddingTask(!addingTask)}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="Добавить задачу"
          >
            <MdAdd className="text-lg" />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Удалить проект"
          >
            <MdDelete className="text-lg" />
          </button>
        </div>
      </div>

      {/* Add task form */}
      {addingTask && (
        <form onSubmit={handleAddTask} className="flex items-center gap-2 px-4 py-2 bg-accent/30 border-b border-border">
          <input
            autoFocus
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Название задачи..."
            className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none"
          >
            <option value="LOW">Низкий</option>
            <option value="MEDIUM">Средний</option>
            <option value="HIGH">Высокий</option>
          </select>
          <button type="submit" className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90">
            Добавить
          </button>
          <button type="button" onClick={() => setAddingTask(false)} className="text-sm text-muted-foreground hover:text-foreground">
            Отмена
          </button>
        </form>
      )}

      {/* Kanban columns */}
      {expanded && (
        <div className="grid grid-cols-3 gap-0 divide-x divide-border">
          {columns.map(({ status, label }) => {
            const tasks = project.tasks.filter((t) => t.status === status);
            return (
              <div key={status} className="p-3 space-y-2 min-h-24">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="text-xs text-muted-foreground bg-accent rounded-full px-1.5 py-0.5">
                    {tasks.length}
                  </span>
                </div>
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={onTaskStatusChange}
                    onDelete={onTaskDelete}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
