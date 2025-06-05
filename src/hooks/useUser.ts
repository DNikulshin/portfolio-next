import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/shared/lib/actions";

const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });
};

export { useUser };
