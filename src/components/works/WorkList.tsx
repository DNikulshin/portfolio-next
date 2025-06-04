import { useGetWorkList } from "@/hooks/useWork";
import { Slider } from "../Slider";
import { Loader } from "../Loader";

export const WorkList = () => {
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

  return <Slider list={data?.works} />;
};
