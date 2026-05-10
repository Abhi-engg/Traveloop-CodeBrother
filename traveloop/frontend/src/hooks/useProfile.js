import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

const fetchProfile = async () => {
  const response = await apiClient.get("/profile/");
  return response.data;
};

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
