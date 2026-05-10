import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ActivityCard from "../components/ActivityCard";
import { apiClient } from "../api/client";
import { useActivities } from "../hooks/useActivities";
import { useCities } from "../hooks/useCities";
import { useStopActivities } from "../hooks/useStopActivities";
import { useStops } from "../hooks/useStops";
import { useTrips } from "../hooks/useTrips";

const MAX_COST = 200;
const MAX_DURATION = 8;

const CATEGORY_IMAGES = {
  culture:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
  food:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  music:
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
  adventure:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  nature:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
  view:
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
  general:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
};

const getCategoryKey = (category) =>
  (category || "general").trim().toLowerCase();

const getImageForActivity = (activity) => {
  const key = getCategoryKey(activity.category);
  return CATEGORY_IMAGES[key] || CATEGORY_IMAGES.general;
};

const getCostTier = (cost) => {
  if (cost <= 20) {
    return "Budget";
  }
  if (cost <= 60) {
    return "Mid";
  }
  return "Premium";
};

const formatCost = (cost) => (cost > 0 ? `$${Math.round(cost)}` : "Free");
const formatDuration = (hours) => (hours > 0 ? `${hours}h` : "Flexible");

const buildDescription = (activity, cityName) => {
  const category = (activity.category || "activity").toLowerCase();
  const place = cityName ? ` in ${cityName}` : "";
  const duration = activity.duration_hours
    ? `${activity.duration_hours}h`
    : "flexible time";
  const cost = activity.avg_cost_usd
    ? `$${Math.round(activity.avg_cost_usd)}`
    : "free";
  return `A ${category} experience${place}, about ${duration}, around ${cost}.`;
};

const ActivitySearch = () => {
  const queryClient = useQueryClient();
  const { data: trips = [], isLoading: tripsLoading } = useTrips();
  const { data: cities = [] } = useCities();
  const [tripId, setTripId] = useState("");
  const [stopId, setStopId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxCost, setMaxCost] = useState(MAX_COST);
  const [maxDuration, setMaxDuration] = useState(MAX_DURATION);
  const [pendingActivityId, setPendingActivityId] = useState(null);

  useEffect(() => {
    if (!tripId && trips.length) {
      setTripId(trips[0].id);
    }
  }, [tripId, trips]);

  const { data: stops = [], isLoading: stopsLoading } = useStops(tripId);

  useEffect(() => {
    if (!tripId) {
      if (stopId) {
        setStopId("");
      }
      return;
    }
    if (!stops.length) {
      if (stopId) {
        setStopId("");
      }
      return;
    }
    if (!stopId || !stops.some((stop) => stop.id === stopId)) {
      setStopId(stops[0].id);
    }
  }, [tripId, stops, stopId]);

  const selectedStop = stops.find((stop) => stop.id === stopId);
  const selectedCityId = selectedStop?.city_id || "";
  const cityLookup = useMemo(() => {
    const map = new Map();
    cities.forEach((city) => map.set(city.id, city));
    return map;
  }, [cities]);
  const selectedCity = selectedCityId ? cityLookup.get(selectedCityId) : null;

  const { data: activities = [], isLoading: activitiesLoading } = useActivities(
    selectedCityId,
  );
  const { data: stopActivities = [], isLoading: stopActivitiesLoading } =
    useStopActivities(stopId);

  const stopActivityMap = useMemo(() => {
    const map = new Map();
    stopActivities.forEach((item) => map.set(item.activity_id, item));
    return map;
  }, [stopActivities]);

  const addMutation = useMutation({
    mutationFn: (activityId) =>
      apiClient.post(`/stop-activities/stops/${stopId}`, {
        activity_id: activityId,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stop-activities", stopId],
      }),
  });

  const removeMutation = useMutation({
    mutationFn: (stopActivityId) =>
      apiClient.delete(`/stop-activities/${stopActivityId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stop-activities", stopId],
      }),
  });

  const handleAdd = (activityId) => {
    if (!stopId) {
      return;
    }
    setPendingActivityId(activityId);
    addMutation.mutate(activityId, {
      onSettled: () => setPendingActivityId(null),
    });
  };

  const handleRemove = (activityId, stopActivityId) => {
    if (!stopId || !stopActivityId) {
      return;
    }
    setPendingActivityId(activityId);
    removeMutation.mutate(stopActivityId, {
      onSettled: () => setPendingActivityId(null),
    });
  };

  const categories = useMemo(() => {
    const set = new Set();
    activities.forEach((activity) => {
      const category = (activity.category || "General").trim();
      if (category) {
        set.add(category);
      }
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [activities]);

  const costLimit = maxCost >= MAX_COST ? Number.POSITIVE_INFINITY : maxCost;
  const durationLimit =
    maxDuration >= MAX_DURATION ? Number.POSITIVE_INFINITY : maxDuration;

  const filteredActivities = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return activities.filter((activity) => {
      const name = (activity.name || "").toLowerCase();
      const category = (activity.category || "General").trim();
      const cost = Number(activity.avg_cost_usd) || 0;
      const duration = Number(activity.duration_hours) || 0;

      const matchesSearch =
        !term || name.includes(term) || category.toLowerCase().includes(term);
      const matchesCategory =
        selectedCategory === "All" || category === selectedCategory;
      const matchesCost = cost <= costLimit;
      const matchesDuration = duration === 0 || duration <= durationLimit;

      return matchesSearch && matchesCategory && matchesCost && matchesDuration;
    });
  }, [activities, searchTerm, selectedCategory, costLimit, durationLimit]);

  const isEmpty = !activitiesLoading && filteredActivities.length === 0;
  const selectionLabel = selectedCity
    ? `${selectedCity.name}, ${selectedCity.country}`
    : "Select a stop";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            Activity search
          </p>
          <h1 className="mt-2 text-3xl">Pick your highlights</h1>
          <p className="mt-2 text-sm text-[var(--slate)]">
            Browse and add experiences for each stop.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            placeholder="Search activity"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            value={tripId || ""}
            onChange={(event) =>
              setTripId(event.target.value ? Number(event.target.value) : "")
            }
          >
            <option value="">Select trip</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </select>
          <select
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            value={stopId || ""}
            onChange={(event) =>
              setStopId(event.target.value ? Number(event.target.value) : "")
            }
            disabled={!tripId || stopsLoading}
          >
            <option value="">Select stop</option>
            {stops.map((stop) => {
              const city = cityLookup.get(stop.city_id);
              const label = city
                ? `${city.name}, ${city.country}`
                : `Stop ${stop.id}`;
              return (
                <option key={stop.id} value={stop.id}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow)]">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Type
            </p>
            <select
              className="w-full rounded-full border border-[var(--border)] px-4 py-2 text-sm"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              <span>Max cost</span>
              <span className="font-mono">
                {maxCost >= MAX_COST ? "Any" : `$${maxCost}`}
              </span>
            </div>
            <input
              className="w-full"
              type="range"
              min="0"
              max={MAX_COST}
              value={maxCost}
              onChange={(event) => setMaxCost(Number(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              <span>Max duration</span>
              <span className="font-mono">
                {maxDuration >= MAX_DURATION ? "Any" : `${maxDuration}h`}
              </span>
            </div>
            <input
              className="w-full"
              type="range"
              min="1"
              max={MAX_DURATION}
              value={maxDuration}
              onChange={(event) => setMaxDuration(Number(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Selected stop
            </p>
            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--slate)]">
              {selectionLabel}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--slate)]">
          <span>
            {filteredActivities.length} activities
            {stopActivitiesLoading ? " (loading selections)" : ""}
          </span>
          <span>
            Added to stop: {stopActivities.length}
            {tripId ? "" : " (select a trip)"}
          </span>
        </div>
      </div>

      {tripsLoading ? (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--slate)]">
          Loading trips...
        </div>
      ) : null}

      {!tripsLoading && trips.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--slate)]">
          Create a trip first, then return to add activities.
        </div>
      ) : null}

      {!stopsLoading && tripId && stops.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--slate)]">
          Add a stop to this trip to browse activities.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {activitiesLoading ? (
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--slate)]">
            Loading activities...
          </div>
        ) : null}
        {isEmpty ? (
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--slate)]">
            No activities match the filters.
          </div>
        ) : null}
        {filteredActivities.map((activity) => {
          const cost = Number(activity.avg_cost_usd) || 0;
          const duration = Number(activity.duration_hours) || 0;
          const stopActivity = stopActivityMap.get(activity.id);
          const isSelected = Boolean(stopActivity);
          const isBusy = pendingActivityId === activity.id;
          const actionDisabled = !stopId || addMutation.isLoading || removeMutation.isLoading;

          return (
            <ActivityCard
              key={activity.id || activity.name}
              activity={activity}
              description={buildDescription(activity, selectedCity?.name)}
              imageUrl={getImageForActivity(activity)}
              costLabel={formatCost(cost)}
              durationLabel={formatDuration(duration)}
              costTier={getCostTier(cost)}
              isSelected={isSelected}
              isBusy={isBusy}
              actionDisabled={actionDisabled}
              actionLabel={!stopId ? "Select stop" : undefined}
              onAdd={() => handleAdd(activity.id)}
              onRemove={() => handleRemove(activity.id, stopActivity?.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ActivitySearch;
