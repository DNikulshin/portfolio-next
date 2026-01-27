import {
} from "@/types/types";
import { Work } from "@prisma/client";
import {  useQueryClient, useMutation } from "@tanstack/react-query";

const create = async (formData: FormData): Promise<Work> => {
  try {
    const data = await fetch("/api/works", {
      method: "POST",
      body: formData,
    });

    return await data.json();
  } catch (error) {
    throw error;
  }
};

const update = async (formData: FormData): Promise<Work> => {
  const workId = formData.get("workId");
  try {
    const data = await fetch(`/api/works/${workId}`, {
      method: "POST",
      body: formData,
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

const useCreateNewWork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (work: FormData) => create(work),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["works"] });
    },
  });
};

const useUpdateWork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (work: FormData) => update(work),
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

export { useCreateNewWork, useDeleteWork, useUpdateWork };
