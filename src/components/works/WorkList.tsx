import { Slider } from "../Slider";
import { WorkItem } from "./Work";
import { getWorks } from "@/shared/api/getWorks";

interface Props {
  type: "slider" | "list";
}

export const WorkList = async ({ type }: Props) => {
  const data = await getWorks();

  if (!data?.works?.length) {
    return (
      <div className="w-full text-center">
        <p className="text-red-500">Not work. Add one.</p>
      </div>
    );
  }

  return (
    <>
      {type === "slider" && <Slider list={data?.works} />}
      {type === "list" && (
        <div className="flex flex-col gap-4 px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            Works totalCount :{" "}
            <span className="font-bold text-green-500/85">
              {data?.totalCount}
            </span>
          </div>
          {data?.works &&
            data?.works.map((work) => <WorkItem {...work} key={work.id} />)}
        </div>
      )}
    </>
  );
};
