import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

const fetchTrips = async () => {
  const response = await apiClient.get("/trips/");
  return response.data;
};

export const useTrips = () =>
  useQuery({
    queryKey: ["trips"],
    queryFn: fetchTrips,
  });
