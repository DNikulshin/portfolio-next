import { IFormDataCreateWork, IResponseDataWork } from "@/types/types";
import { Work } from "@prisma/client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const getWoks = async (): Promise<IResponseDataWork> => {
  try {
    const data = await fetch(`/api/works`);
    return data.json();
  } catch (error) {
    console.error("Error fetching works:", error);
    throw error;
  }
};

const create = async (formData: IFormDataCreateWork): Promise<Work> => {
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
    });

    return await data.json();
  } catch (error) {
    throw error;
  }
};

const remove = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/works/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete work with id ${id}`);
    }
  } catch (error) {
    console.error("Error deleting work:", error);
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
    mutationFn: (work: IFormDataCreateWork) => create(work),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["works"] });
    },
  });
};

const useDeleteWork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remove(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["works"] });
    },
  });
};

export { useGetWorkList, useCreateNewWork, useDeleteWork };
