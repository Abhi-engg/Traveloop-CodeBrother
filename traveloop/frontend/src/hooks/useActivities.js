import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

const fetchActivities = async (cityId) => {
  const response = await apiClient.get(`/activities/cities/${cityId}`);
  return response.data;
};

export const useActivities = (cityId) =>
  useQuery({
    queryKey: ["activities", cityId],
    queryFn: () => fetchActivities(cityId),
    enabled: Boolean(cityId),
  });
