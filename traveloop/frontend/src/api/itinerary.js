import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";

/* ═══════════════════════════════════════════════════════════════
   CITIES
   ═══════════════════════════════════════════════════════════════ */

const fetchCities = async (search = "") => {
  const response = await apiClient.get("/cities/", { params: search ? { q: search } : {} });
  return response.data;
};

export const useCities = (search = "") =>
  useQuery({
    queryKey: ["cities", search],
    queryFn: () => fetchCities(search),
  });

/* ═══════════════════════════════════════════════════════════════
   STOPS
   ═══════════════════════════════════════════════════════════════ */

const fetchStops = async (tripId) => {
  const response = await apiClient.get(`/stops/trips/${tripId}`);
  return response.data;
};

export const useStops = (tripId) =>
  useQuery({
    queryKey: ["stops", tripId],
    queryFn: () => fetchStops(tripId),
    enabled: !!tripId,
  });

const createStop = async ({ tripId, data }) => {
  const response = await apiClient.post(`/stops/trips/${tripId}`, data);
  return response.data;
};

export const useCreateStop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createStop,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["stops", variables.tripId] });
    },
  });
};

const updateStop = async ({ stopId, data }) => {
  const response = await apiClient.put(`/stops/${stopId}`, data);
  return response.data;
};

export const useUpdateStop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateStop,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stops"] });
    },
  });
};

const deleteStop = async (stopId) => {
  await apiClient.delete(`/stops/${stopId}`);
};

export const useDeleteStop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteStop,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stops"] });
    },
  });
};

const reorderStops = async ({ tripId, orderedIds }) => {
  const response = await apiClient.put(`/stops/trips/${tripId}/reorder`, {
    ordered_ids: orderedIds,
  });
  return response.data;
};

export const useReorderStops = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reorderStops,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["stops", variables.tripId] });
    },
  });
};

/* ═══════════════════════════════════════════════════════════════
   ACTIVITIES (per city)
   ═══════════════════════════════════════════════════════════════ */

const fetchActivities = async (cityId) => {
  const response = await apiClient.get(`/activities/cities/${cityId}`);
  return response.data;
};

export const useActivities = (cityId) =>
  useQuery({
    queryKey: ["activities", cityId],
    queryFn: () => fetchActivities(cityId),
    enabled: !!cityId,
  });

/* ═══════════════════════════════════════════════════════════════
   STOP ACTIVITIES
   ═══════════════════════════════════════════════════════════════ */

const fetchStopActivities = async (stopId) => {
  const response = await apiClient.get(`/stop-activities/stops/${stopId}`);
  return response.data;
};

export const useStopActivities = (stopId) =>
  useQuery({
    queryKey: ["stop-activities", stopId],
    queryFn: () => fetchStopActivities(stopId),
    enabled: !!stopId,
  });

const createStopActivity = async ({ stopId, data }) => {
  const response = await apiClient.post(`/stop-activities/stops/${stopId}`, data);
  return response.data;
};

export const useCreateStopActivity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createStopActivity,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["stop-activities", variables.stopId] });
    },
  });
};

const deleteStopActivity = async (stopActivityId) => {
  await apiClient.delete(`/stop-activities/${stopActivityId}`);
};

export const useDeleteStopActivity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteStopActivity,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stop-activities"] });
    },
  });
};
