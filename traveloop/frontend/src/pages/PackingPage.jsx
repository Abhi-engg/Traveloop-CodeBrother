import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { usePackingItems } from "../hooks/usePackingItems";
import { useTrips } from "../hooks/useTrips";

const CATEGORY_OPTIONS = [
  { value: "clothing", label: "Clothing" },
  { value: "documents", label: "Documents" },
  { value: "electronics", label: "Electronics" },
  { value: "toiletries", label: "Toiletries" },
  { value: "misc", label: "Misc" },
];

const normalizeCategory = (value) =>
  (value || "misc").trim().toLowerCase();

const getCategoryLabel = (value) => {
  const normalized = normalizeCategory(value);
  return (
    CATEGORY_OPTIONS.find((option) => option.value === normalized)?.label ||
    "Misc"
  );
};

const buildCategoryCounts = (items) => {
  const counts = {};
  items.forEach((item) => {
    const key = normalizeCategory(item.category);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
};

const PackingPage = () => {
  const queryClient = useQueryClient();
  const { data: trips = [], isLoading: tripsLoading } = useTrips();
  const [tripId, setTripId] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newCategory, setNewCategory] = useState("clothing");
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => {
    if (!tripId && trips.length) {
      setTripId(trips[0].id);
    }
  }, [tripId, trips]);

  const {
    data: items = [],
    isLoading: itemsLoading,
    isFetching: itemsFetching,
  } = usePackingItems(tripId);

  const groupedItems = useMemo(() => {
    const groups = {};
    items.forEach((item) => {
      const key = normalizeCategory(item.category);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return groups;
  }, [items]);

  const categoryCounts = useMemo(() => buildCategoryCounts(items), [items]);
  const packedCount = items.filter((item) => item.is_packed).length;

  const addMutation = useMutation({
    mutationFn: ({ label, category }) =>
      apiClient.post(`/packing-items/trips/${tripId}`, {
        label,
        category,
        is_packed: false,
      }),
    onSuccess: () => {
      setNewLabel("");
      queryClient.invalidateQueries({
        queryKey: ["packing-items", tripId],
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (item) =>
      apiClient.put(`/packing-items/${item.id}`, {
        label: item.label,
        category: item.category || "",
        is_packed: !item.is_packed,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["packing-items", tripId],
      }),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId) => apiClient.delete(`/packing-items/${itemId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["packing-items", tripId],
      }),
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      const updates = items.map((item) =>
        apiClient.put(`/packing-items/${item.id}`, {
          label: item.label,
          category: item.category || "",
          is_packed: false,
        }),
      );
      return Promise.all(updates);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["packing-items", tripId],
      }),
  });

  const handleAdd = (event) => {
    event.preventDefault();
    const trimmed = newLabel.trim();
    if (!trimmed || !tripId) {
      return;
    }
    addMutation.mutate({
      label: trimmed,
      category: newCategory,
    });
  };

  const handleToggle = (item) => {
    setPendingId(item.id);
    toggleMutation.mutate(item, {
      onSettled: () => setPendingId(null),
    });
  };

  const handleRemove = (itemId) => {
    setPendingId(itemId);
    removeMutation.mutate(itemId, {
      onSettled: () => setPendingId(null),
    });
  };

  const handleReset = () => {
    if (!items.length || !tripId) {
      return;
    }
    setPendingId("reset");
    resetMutation.mutate(undefined, {
      onSettled: () => setPendingId(null),
    });
  };

  const isBusy =
    addMutation.isLoading ||
    toggleMutation.isLoading ||
    removeMutation.isLoading ||
    resetMutation.isLoading;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Packing checklist
            </p>
            <h2 className="mt-3 text-2xl">Stay ready for every stop</h2>
            <p className="mt-2 text-sm text-[var(--slate)]">
              Add items, check them off, and reset for the next trip.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
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
            <button
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                items.length && tripId && !isBusy
                  ? "border border-[var(--border)] bg-white text-[var(--indigo)]"
                  : "cursor-not-allowed bg-[var(--border)] text-[var(--slate)]"
              }`}
              onClick={handleReset}
              disabled={!items.length || !tripId || isBusy}
            >
              Reset checklist
            </button>
          </div>
        </div>

        <form
          className="mt-6 flex flex-wrap gap-3 rounded-2xl border border-[var(--border)] bg-[var(--cream)]/60 p-4"
          onSubmit={handleAdd}
        >
          <input
            className="flex-1 rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            placeholder="Add packing item"
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
          />
          <select
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              tripId && newLabel.trim() && !isBusy
                ? "bg-[var(--indigo)] text-white"
                : "cursor-not-allowed bg-[var(--border)] text-[var(--slate)]"
            }`}
            type="submit"
            disabled={!tripId || !newLabel.trim() || isBusy}
          >
            Add item
          </button>
        </form>

        {!tripId && !tripsLoading ? (
          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--sand)]/40 p-4 text-sm text-[var(--slate)]">
            Create a trip first, then build the packing list.
          </div>
        ) : null}

        {itemsLoading ? (
          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-4 text-sm text-[var(--slate)]">
            Loading packing list...
          </div>
        ) : null}

        {!itemsLoading && tripId && items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-4 text-sm text-[var(--slate)]">
            No items yet. Add your first checklist item.
          </div>
        ) : null}

        <div className="mt-6 space-y-6">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
                <span>{getCategoryLabel(category)}</span>
                <span className="font-mono">{categoryItems.length}</span>
              </div>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--cream)]/70 px-4 py-3"
                  >
                    <label className="flex items-center gap-3 text-sm text-[var(--slate)]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-[var(--border)]"
                        checked={Boolean(item.is_packed)}
                        onChange={() => handleToggle(item)}
                        disabled={isBusy}
                      />
                      <span
                        className={
                          item.is_packed
                            ? "line-through text-[var(--slate)]/70"
                            : ""
                        }
                      >
                        {item.label}
                      </span>
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded-full bg-white px-3 py-1 text-[var(--slate)]">
                        {getCategoryLabel(item.category)}
                      </span>
                      <button
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                          pendingId === item.id || isBusy
                            ? "cursor-not-allowed bg-[var(--border)] text-[var(--slate)]"
                            : "bg-white text-[var(--indigo)]"
                        }`}
                        onClick={() => handleRemove(item.id)}
                        disabled={pendingId === item.id || isBusy}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--sand)]/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
          Packing summary
        </p>
        <p className="mt-3 text-lg">Keep tabs on what is ready</p>
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-4">
          <div className="flex items-center justify-between text-sm">
            <span>Total items</span>
            <span className="font-mono">{items.length}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Packed</span>
            <span className="font-mono">{packedCount}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Remaining</span>
            <span className="font-mono">{items.length - packedCount}</span>
          </div>
          {itemsFetching ? (
            <p className="mt-3 text-xs text-[var(--slate)]">
              Updating list...
            </p>
          ) : null}
        </div>

        <div className="mt-6 space-y-3 text-sm text-[var(--slate)]">
          {CATEGORY_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
            >
              <span>{option.label}</span>
              <span className="font-mono">
                {categoryCounts[option.value] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackingPage;
