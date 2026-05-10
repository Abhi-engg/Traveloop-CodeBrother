import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useCities } from "../hooks/useCities";
import { useStops } from "../hooks/useStops";
import { useTrips } from "../hooks/useTrips";

const formatCostIndex = (value) => {
  if (value === null || value === undefined) {
    return "n/a";
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return "n/a";
  }
  return numeric.toFixed(1);
};

const CitySearch = () => {
  const queryClient = useQueryClient();
  const { data: cities = [], isLoading: citiesLoading } = useCities();
  const { data: trips = [], isLoading: tripsLoading } = useTrips();
  const [tripId, setTripId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [pendingCityId, setPendingCityId] = useState(null);

  useEffect(() => {
    if (!tripId && trips.length) {
      setTripId(trips[0].id);
    }
  }, [tripId, trips]);

  const { data: stops = [], isLoading: stopsLoading } = useStops(tripId);

  const cityIdsInTrip = useMemo(() => {
    const set = new Set();
    stops.forEach((stop) => set.add(stop.city_id));
    return set;
  }, [stops]);

  const countryOptions = useMemo(() => {
    const set = new Set();
    cities.forEach((city) => {
      if (city.country) {
        set.add(city.country);
      }
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [cities]);

  const filteredCities = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return cities
      .filter((city) => {
        const matchesTerm =
          !term ||
          city.name?.toLowerCase().includes(term) ||
          city.country?.toLowerCase().includes(term);
        const matchesCountry =
          countryFilter === "All" || city.country === countryFilter;
        return matchesTerm && matchesCountry;
      })
      .sort((a, b) => {
        const popDiff = (b.popularity || 0) - (a.popularity || 0);
        if (popDiff !== 0) {
          return popDiff;
        }
        return (a.name || "").localeCompare(b.name || "");
      });
  }, [cities, searchTerm, countryFilter]);

  const addStopMutation = useMutation({
    mutationFn: ({ cityId, order }) =>
      apiClient.post(`/stops/trips/${tripId}`, {
        city_id: cityId,
        order,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["stops", tripId] }),
  });

  const handleAddToTrip = (cityId) => {
    if (!tripId || cityIdsInTrip.has(cityId)) {
      return;
    }
    const nextOrder = stops.length
      ? Math.max(...stops.map((stop) => stop.order ?? 0)) + 1
      : 1;
    setPendingCityId(cityId);
    addStopMutation.mutate(
      { cityId, order: nextOrder },
      { onSettled: () => setPendingCityId(null) },
    );
  };

  const hasTrips = trips.length > 0;
  const hasCities = filteredCities.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            City search
          </p>
          <h1 className="mt-2 text-3xl">Discover destinations</h1>
          <p className="mt-2 text-sm text-[var(--slate)]">
            Search cities and add them to your trip itinerary.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            placeholder="Search city"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            value={countryFilter}
            onChange={(event) => setCountryFilter(event.target.value)}
          >
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            value={tripId || ""}
            onChange={(event) =>
              setTripId(event.target.value ? Number(event.target.value) : "")
            }
            disabled={tripsLoading}
          >
            <option value="">Select trip</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!tripsLoading && !hasTrips ? (
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--slate)]">
          Create a trip first, then add cities to build your itinerary.
        </div>
      ) : null}

      {citiesLoading ? (
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--slate)]">
          Loading cities...
        </div>
      ) : null}

      {!citiesLoading && !hasCities ? (
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--slate)]">
          No cities match the current filters.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {filteredCities.map((city) => {
          const isAdded = cityIdsInTrip.has(city.id);
          const isBusy = pendingCityId === city.id;
          const canAdd = Boolean(tripId) && !isAdded && !isBusy && !stopsLoading;
          return (
            <div
              key={city.id || city.name}
              className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
                    {city.country || "Unknown"}
                  </p>
                  <h3 className="mt-2 text-2xl">{city.name}</h3>
                </div>
                {isAdded ? (
                  <span className="rounded-full bg-[var(--indigo)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
                    Added
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--slate)]">
                <span className="rounded-full bg-[var(--sand)] px-3 py-1">
                  Cost index {formatCostIndex(city.cost_index)}
                </span>
                <span className="rounded-full bg-[var(--lavender)]/20 px-3 py-1 text-[var(--indigo)]">
                  Popularity {city.popularity ?? 0}
                </span>
              </div>
              <button
                className={`mt-4 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  canAdd
                    ? "bg-[var(--coral)] text-white"
                    : "cursor-not-allowed bg-[var(--border)] text-[var(--slate)]"
                }`}
                onClick={() => handleAddToTrip(city.id)}
                disabled={!canAdd}
              >
                {isBusy
                  ? "Adding..."
                  : isAdded
                    ? "Added to trip"
                    : tripId
                      ? "Add to trip"
                      : "Select trip"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CitySearch;
