import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useTrips } from "../../api/trips";
import { useStops, useReorderStops } from "../../api/itinerary";
import { AddStopModal, StopCard } from "./components";
import "./ItineraryBuilderPage.css";

const ItineraryBuilderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);

  /* ── Trip selection ──────────────────────────────────────────── */
  const { data: trips = [], isLoading: tripsLoading } = useTrips();
  const selectedTripId = searchParams.get("trip")
    ? Number(searchParams.get("trip"))
    : trips[0]?.id ?? null;

  const selectedTrip = trips.find((t) => t.id === selectedTripId);

  const selectTrip = (id) => {
    setSearchParams({ trip: id });
  };

  /* ── Stops for selected trip ─────────────────────────────────── */
  const { data: stops = [], isLoading: stopsLoading } = useStops(selectedTripId);
  const reorder = useReorderStops();

  /* ── Drag & drop ─────────────────────────────────────────────── */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stops.findIndex((s) => s.id === active.id);
    const newIndex = stops.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(stops, oldIndex, newIndex);

    reorder.mutate({
      tripId: selectedTripId,
      orderedIds: reordered.map((s) => s.id),
    });
  };

  /* ── Loading state ───────────────────────────────────────────── */
  if (tripsLoading) {
    return (
      <div className="space-y-6">
        <div className="ib-skeleton" style={{ height: 80 }} />
        <div className="ib-skeleton" style={{ height: 48 }} />
        <div className="ib-skeleton" style={{ height: 200 }} />
      </div>
    );
  }

  /* ── No trips state ──────────────────────────────────────────── */
  if (trips.length === 0) {
    return (
      <div className="ib-empty">
        <div className="ib-empty__icon">🗺️</div>
        <h2 className="ib-empty__title">No trips yet</h2>
        <p className="ib-empty__text">
          Create your first trip, then come back here to build your itinerary
          stop by stop.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="ib-header">
        <div>
          <p className="ib-header__label">Itinerary builder</p>
          <h1 className="ib-header__title">
            {selectedTrip ? selectedTrip.name : "Shape your route"}
          </h1>
          {selectedTrip && (
            <p className="ib-header__subtitle">
              {stops.length} stop{stops.length !== 1 ? "s" : ""} planned
            </p>
          )}
        </div>
        <div className="ib-header__actions">
          <button
            className="ib-modal__btn ib-modal__btn--primary"
            onClick={() => setShowModal(true)}
            disabled={!selectedTripId}
            id="ib-add-stop-btn"
          >
            ＋ Add stop
          </button>
        </div>
      </div>

      {/* ── Trip Selector ───────────────────────────────────────── */}
      <div className="ib-trip-bar">
        {trips.map((t) => (
          <button
            key={t.id}
            className={`ib-trip-chip ${
              t.id === selectedTripId ? "ib-trip-chip--active" : ""
            }`}
            onClick={() => selectTrip(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* ── Stops Timeline ──────────────────────────────────────── */}
      {stopsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="ib-skeleton" style={{ height: 160 }} />
          ))}
        </div>
      ) : stops.length === 0 ? (
        <div className="ib-empty">
          <div className="ib-empty__icon">📍</div>
          <h2 className="ib-empty__title">No stops yet</h2>
          <p className="ib-empty__text">
            Add your first city to start building the itinerary for{" "}
            <strong>{selectedTrip?.name}</strong>.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={stops.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="ib-timeline">
              {stops.map((stop, idx) => (
                <StopCard key={stop.id} stop={stop} index={idx} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* ── Add Stop Button (bottom) ────────────────────────────── */}
      {stops.length > 0 && (
        <button
          className="ib-add-stop"
          onClick={() => setShowModal(true)}
          style={{ marginTop: "1.5rem" }}
          id="ib-add-stop-bottom"
        >
          <span>＋</span> Add another stop
        </button>
      )}

      {/* ── Add Stop Modal ──────────────────────────────────────── */}
      {showModal && selectedTripId && (
        <AddStopModal
          tripId={selectedTripId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ItineraryBuilderPage;
