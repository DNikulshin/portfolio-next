import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createNewWork as createNewWorkApi,
  deleteWork as deleteWorkApi,
  runDbSeed as runDbSeedApi,
  updateWork as updateWorkApi,
} from "@/shared/api/works";
import { getWorksClient } from "@/shared/api/client/getWorks";
import { logout } from "@/shared/lib/actions";
import { useRouter } from "next/navigation";

// --- QUERIES (ЗАПРОСЫ ДАННЫХ) ---

export const useWorks = () => {
  return useQuery({
    queryKey: ["works"],
    queryFn: getWorksClient,
  });
};

// --- MUTATIONS (ИЗМЕНЕНИЕ ДАННЫХ) ---

export const useCreateNewWork = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createNewWorkApi,
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      toast.success("Новая работа успешно создана!");
      queryClient.invalidateQueries({ queryKey: ["works"] });
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });
};

export const useUpdateWork = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateWorkApi(id, data),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      toast.success("Работа успешно обновлена!");
      queryClient.invalidateQueries({ queryKey: ["works"] });
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });
};

export const useDeleteWork = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteWorkApi,
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      toast.success("Работа успешно удалена!");
      queryClient.invalidateQueries({ queryKey: ["works"] });
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });
};

export const useRunSeed = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: runDbSeedApi,
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      toast.success("База данных сброшена! Вы будете разлогинены.");
      
      queryClient.invalidateQueries({ queryKey: ["works"] });
      router.refresh();

      // Добавляем небольшую задержку, чтобы пользователь успел прочитать тост
      setTimeout(() => {
        logout();
      }, 2500);
    },
    onError: (error) => {
      toast.error(`Ошибка при восстановлении: ${error.message}`);
    },
  });
};
