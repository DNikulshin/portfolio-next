export const getWorksClient = async () => {
  try {
    const response = await fetch("/api/works", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении работ на клиенте:", error);
    throw error; // Перебрасываем ошибку, чтобы React Query мог ее обработать
  }
};
