import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";

/* ─── Fetch all trips ───────────────────────────────────── */
const fetchTrips = async () => {
  const response = await apiClient.get("/trips/");
  return response.data;
};

export const useTrips = () =>
  useQuery({
    queryKey: ["trips"],
    queryFn: fetchTrips,
  });

/* ─── Fetch single trip ─────────────────────────────────── */
const fetchTrip = async (tripId) => {
  const response = await apiClient.get(`/trips/${tripId}`);
  return response.data;
};

export const useTrip = (tripId) =>
  useQuery({
    queryKey: ["trips", tripId],
    queryFn: () => fetchTrip(tripId),
    enabled: !!tripId,
  });

/* ─── Create trip ────────────────────────────────────────── */
const createTrip = async ({ data, coverPhoto }) => {
  const formData = new FormData();

  // Append all trip fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  // Append cover photo if provided
  if (coverPhoto) {
    formData.append("cover_photo", coverPhoto);
  }

  const response = await apiClient.post("/trips/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
};

/* ─── Update trip ────────────────────────────────────────── */
const updateTrip = async ({ tripId, data, coverPhoto }) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  if (coverPhoto) {
    formData.append("cover_photo", coverPhoto);
  }

  const response = await apiClient.put(`/trips/${tripId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTrip,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.setQueryData(["trips", data.id], data);
    },
  });
};

/* ─── Delete trip ────────────────────────────────────────── */
const deleteTrip = async (tripId) => {
  await apiClient.delete(`/trips/${tripId}`);
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
};
