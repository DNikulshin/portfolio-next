import { useGetWorkList } from "@/hooks/useWork";
import { Slider } from "../Slider";
import { Loader } from "../Loader";
import { WorkItem } from "./Work";

interface Props {
  type: "slider" | "list";
}

export const WorkList = ({ type }: Props) => {
  const { data, isFetching } = useGetWorkList();

  if (isFetching) {
    return <Loader />;
  }

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
