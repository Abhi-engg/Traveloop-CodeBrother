import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

/* ─── Fetch dashboard data ──────────────────────────────── */
const fetchDashboard = async () => {
  const response = await apiClient.get("/dashboard/");
  return response.data;
};

export const useDashboard = () =>
  useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes — avoid refetching on every nav
    refetchOnWindowFocus: true,
  });
