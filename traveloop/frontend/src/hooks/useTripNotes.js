import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

const fetchTripNotes = async (tripId) => {
  const response = await apiClient.get(`/notes/trips/${tripId}`);
  return response.data;
};

export const useTripNotes = (tripId) =>
  useQuery({
    queryKey: ["notes", tripId],
    queryFn: () => fetchTripNotes(tripId),
    enabled: Boolean(tripId),
  });
