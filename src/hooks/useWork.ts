import { IFormDataCreateWork, IResponseDataWork } from "@/types/types";
import { Work } from "@prisma/client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const getWoks = async (): Promise<IResponseDataWork> => {
  try {
    const data = await fetch(`/api/works`);
    return data.json() ?? {};
  } catch (error) {
    console.error("Error fetching works:", error);
    throw error;
  }
};

const create = async (
  formData: IFormDataCreateWork,
  signal: AbortSignal,
): Promise<Work> => {
  const formDataObj = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formDataObj.append(key, value);
    }
  });

  try {
    const data = await fetch("/api/works", {
      method: "POST",
      body: formDataObj,
      signal,
    });

    return await data.json();
  } catch (error) {
    throw error;
  }
};

const useGetWorkList = () => {
  return useQuery({
    queryKey: ["works"],
    queryFn: () => getWoks(),
  });
};

const useCreateNewWork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (work: IFormDataCreateWork) => {
      const controller = new AbortController();
      const signal = controller.signal;
      const mutation = create(work, signal);
      try {
        return await mutation;
      } finally {
        return controller.abort();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["works"] });
    },
  });
};

export { useGetWorkList, useCreateNewWork };
