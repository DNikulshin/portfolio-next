export const createNewWork = async (data: FormData) => {
  const response = await fetch("/api/works", {
    method: "POST",
    body: data,
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.error || "Ошибка создания работы");
  return json;
};

export const updateWork = async (id: string, data: FormData) => {
  const response = await fetch(`/api/works/${id}`, {
    method: "PATCH",
    body: data,
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.error || "Ошибка обновления работы");
  return json;
};

export const deleteWork = async (id: string) => {
  const response = await fetch(`/api/works/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.error || "Ошибка удаления работы");
  return json;
};
