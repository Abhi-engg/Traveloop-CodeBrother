import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

const fetchCities = async () => {
  const response = await apiClient.get("/cities/");
  return response.data;
};

export const useCities = () =>
  useQuery({
    queryKey: ["cities"],
    queryFn: fetchCities,
  });
