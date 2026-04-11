"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project, Task, TaskStatus, ProjectStatus } from "@prisma/client";
import { ProjectCard } from "@/components/dashboard/projects/ProjectCard";
import { MdAdd } from "react-icons/md";

type ProjectWithTasks = Project & { tasks: Task[] };

async function fetchProjects(): Promise<ProjectWithTasks[]> {
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error("Ошибка загрузки проектов");
  return res.json();
}

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [deployUrl, setDeployUrl] = useState("");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const createProject = useMutation({
    mutationFn: (body: object) =>
      fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsCreating(false);
      setTitle(""); setDescription(""); setGithubUrl(""); setDeployUrl("");
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => fetch(`/api/projects/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const updateProjectStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
      fetch(`/api/projects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const addTask = useMutation({
    mutationFn: (body: object) =>
      fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const updateTaskStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      fetch(`/api/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => fetch(`/api/tasks/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createProject.mutate({ title, description, githubUrl, deployUrl });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Проекты</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} проектов</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
        >
          <MdAdd className="text-lg" />
          {isCreating ? "Отмена" : "Новый проект"}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold">Новый проект</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm text-muted-foreground">Название *</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Мой проект" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm text-muted-foreground">Описание</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Краткое описание" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">GitHub URL</label>
              <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="https://github.com/..." />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Deploy URL</label>
              <input value={deployUrl} onChange={(e) => setDeployUrl(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-sm rounded-md border border-border hover:bg-accent transition-colors">
              Отмена
            </button>
            <button type="submit" disabled={createProject.isPending}
              className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {createProject.isPending ? "Создание..." : "Создать"}
            </button>
          </div>
        </form>
      )}

      {isLoading && (
        <div className="text-center py-16 text-muted-foreground">Загрузка...</div>
      )}

      {!isLoading && projects.length === 0 && (
        <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
          Проектов пока нет. Создайте первый!
        </div>
      )}

      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={(id) => deleteProject.mutate(id)}
            onStatusChange={(id, status) => updateProjectStatus.mutate({ id, status })}
            onTaskStatusChange={(id, status) => updateTaskStatus.mutate({ id, status })}
            onTaskDelete={(id) => deleteTask.mutate(id)}
            onAddTask={(projectId, title, priority) => addTask.mutate({ projectId, title, priority })}
          />
        ))}
      </div>
    </div>
  );
}
