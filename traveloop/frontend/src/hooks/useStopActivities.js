import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

const fetchStopActivities = async (stopId) => {
  const response = await apiClient.get(`/stop-activities/stops/${stopId}`);
  return response.data;
};

export const useStopActivities = (stopId) =>
  useQuery({
    queryKey: ["stop-activities", stopId],
    queryFn: () => fetchStopActivities(stopId),
    enabled: Boolean(stopId),
  });
