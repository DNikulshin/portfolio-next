'use client';

import { useWorks } from "@/hooks/useWork";
import { Slider } from "../Slider";
import { WorkItem } from "./Work";
import { WorkSliderSkeleton } from "./WorkSliderSkeleton";
import { Loader } from "@/components/Loader";
import { Work } from "@prisma/client"; // ИМПОРТ ТИПА

interface Props {
  type: "slider" | "list";
}

export const WorkList = ({ type }: Props) => {
  const { data, isLoading, isError, error } = useWorks();

  // Состояние загрузки
  if (isLoading) {
    return type === "slider" ? <WorkSliderSkeleton /> : <Loader type="h-full" />;
  }

  // Состояние ошибки
  if (isError) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-red-500 font-bold">
          Ошибка загрузки работ: {(error as Error).message}
        </p>
      </div>
    );
  }

  // Если нет работ
  if (!data?.works?.length) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-gray-500">
          {type === "list" ? "Работ пока нет. Добавьте первую!" : "Проектов для отображения нет."}
        </p>
      </div>
    );
  }

  // Успешная загрузка
  return (
    <>
      {type === "slider" && <Slider list={data?.works} />}
      {type === "list" && (
        <div className="flex flex-col gap-4 px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            Всего работ:
            <span className="font-bold text-green-500/85">
              {data?.totalCount}
            </span>
          </div>
          {/* ИЗМЕНЕНО: Добавлен тип для work */}
          {data?.works.map((work: Work) => <WorkItem {...work} key={work.id} />)}
        </div>
      )}
    </>
  );
};
