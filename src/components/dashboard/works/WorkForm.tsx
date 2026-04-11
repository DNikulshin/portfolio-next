"use client";

import { useState } from "react";
import { Work } from "@prisma/client";
import { useCreateNewWork, useUpdateWork } from "@/hooks/useWork";
import { toast } from "sonner";

interface Props {
  work?: Work;
  onClose: () => void;
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function WorkForm({ work, onClose }: Props) {
  const isEdit = !!work;
  const createWork = useCreateNewWork();
  const updateWork = useUpdateWork();

  const [title, setTitle] = useState(work?.title ?? "");
  const [linkUrl, setLinkUrl] = useState(work?.linkUrl ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const isPending = createWork.isPending || updateWork.isPending || uploading;

  function validate(): boolean {
    if (!title.trim()) {
      toast.error("Введите название проекта");
      return false;
    }
    if (!linkUrl.trim() || !isValidUrl(linkUrl)) {
      toast.error("Введите корректный URL (https://...)");
      return false;
    }
    if (!isEdit && !file) {
      toast.error("Выберите изображение");
      return false;
    }
    return true;
  }

  async function uploadImage(): Promise<string | null> {
    if (!file) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        toast.error("Ошибка загрузки изображения");
        return null;
      }
      const data = await res.json();
      return data.url as string;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    let finalImageUrl = work?.imageUrl ?? "";
    if (file) {
      const uploaded = await uploadImage();
      if (!uploaded) return;
      finalImageUrl = uploaded;
    }

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("linkUrl", linkUrl.trim());
    fd.append("imageUrl", finalImageUrl);

    if (isEdit) {
      updateWork.mutate({ id: work.id, data: fd }, { onSuccess: onClose });
    } else {
      createWork.mutate(fd, { onSuccess: onClose });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card border border-border rounded-lg">
      <h3 className="font-semibold text-foreground">
        {isEdit ? "Редактировать работу" : "Новая работа"}
      </h3>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">Название</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Название проекта"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">Ссылка</label>
        <input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="https://..."
        />
        {linkUrl && !isValidUrl(linkUrl) && (
          <p className="text-xs text-red-500">Некорректный URL</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">
          Изображение {isEdit && "(оставьте пустым чтобы не менять)"}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-primary file:text-primary-foreground file:cursor-pointer"
        />
        {!file && isEdit && (
          <p className="text-xs text-muted-foreground truncate">Текущее: {work.imageUrl}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-md border border-border hover:bg-accent transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isPending ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
        </button>
      </div>
    </form>
  );
}
