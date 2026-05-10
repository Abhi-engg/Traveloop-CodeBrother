import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

const fetchPackingItems = async (tripId) => {
  const response = await apiClient.get(`/packing-items/trips/${tripId}`);
  return response.data;
};

export const usePackingItems = (tripId) =>
  useQuery({
    queryKey: ["packing-items", tripId],
    queryFn: () => fetchPackingItems(tripId),
    enabled: Boolean(tripId),
  });
