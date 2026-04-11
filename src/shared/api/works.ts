export const createNewWork = async (data: FormData) => {
  try {
    const response = await fetch("/api/works", {
      method: "POST",
      body: data,
    });
    return await response.json();
  } catch (error) {
    return { error: (error as Error).message || "Что-то пошло не так" };
  }
};

export const updateWork = async (id: string, data: FormData) => {
  try {
    const response = await fetch(`/api/works/${id}`, {
      method: "PATCH",
      body: data,
    });
    return await response.json();
  } catch (error) {
    return { error: (error as Error).message || "Что-то пошло не так" };
  }
};

export const deleteWork = async (id: string) => {
  try {
    const response = await fetch(`/api/works/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    return { error: (error as Error).message || "Что-то пошло не так" };
  }
};
