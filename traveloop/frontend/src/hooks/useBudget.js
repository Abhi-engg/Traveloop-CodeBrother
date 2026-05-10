import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

const fetchBudgetItems = async (tripId) => {
  const response = await apiClient.get(`/budget-items/trips/${tripId}`);
  return response.data;
};

export const useBudget = (tripId) =>
  useQuery({
    queryKey: ["budget-items", tripId],
    queryFn: () => fetchBudgetItems(tripId),
    enabled: Boolean(tripId),
  });
