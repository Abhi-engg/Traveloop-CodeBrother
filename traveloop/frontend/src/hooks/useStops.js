import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

const fetchStops = async (tripId) => {
  const response = await apiClient.get(`/stops/trips/${tripId}`);
  return response.data;
};

export const useStops = (tripId) =>
  useQuery({
    queryKey: ["stops", tripId],
    queryFn: () => fetchStops(tripId),
    enabled: Boolean(tripId),
  });
