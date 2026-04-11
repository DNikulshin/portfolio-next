"use client";

import { useState } from "react";
import { useWorks } from "@/hooks/useWork";
import { WorkItem } from "@/components/dashboard/works/WorkItem";
import { WorkForm } from "@/components/dashboard/works/WorkForm";
import { Work } from "@prisma/client";
import { MdAdd } from "react-icons/md";
import { Loader } from "@/components/Loader";

export default function WorksPage() {
  const [isCreating, setIsCreating] = useState(false);
  const { data, isLoading, isError } = useWorks();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Работы</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data?.totalCount ?? 0} работ в портфолио
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
        >
          <MdAdd className="text-lg" />
          {isCreating ? "Отмена" : "Добавить"}
        </button>
      </div>

      {isCreating && (
        <WorkForm onClose={() => setIsCreating(false)} />
      )}

      {isLoading && <Loader type="h-full" />}

      {isError && (
        <p className="text-destructive text-sm">Ошибка загрузки работ</p>
      )}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {!data?.works?.length ? (
            <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-lg">
              Работ пока нет. Добавьте первую!
            </div>
          ) : (
            data.works.map((work: Work) => (
              <WorkItem key={work.id} work={work} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
