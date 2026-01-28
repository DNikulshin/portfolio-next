import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/shared/lib/actions";
import { IUserData } from "@/types/types";

const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    select: (data): IUserData | null => {
      if (!data) return null;
      // ИЗМЕНЕНО: data.email -> data.userEmail
      return { email: data.userEmail, userId: data.userId };
    },
  });
};

export { useUser };
