import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useCities } from "../hooks/useCities";
import { useStops } from "../hooks/useStops";
import { useTripNotes } from "../hooks/useTripNotes";
import { useTrips } from "../hooks/useTrips";

const NotesPage = () => {
  const queryClient = useQueryClient();
  const { data: trips = [], isLoading: tripsLoading } = useTrips();
  const { data: cities = [] } = useCities();
  const [tripId, setTripId] = useState("");
  const [filterStopId, setFilterStopId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [noteStopId, setNoteStopId] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => {
    if (!tripId && trips.length) {
      setTripId(trips[0].id);
    }
  }, [tripId, trips]);

  const { data: stops = [], isLoading: stopsLoading } = useStops(tripId);
  const {
    data: notes = [],
    isLoading: notesLoading,
    isFetching: notesFetching,
  } = useTripNotes(tripId);

  const cityLookup = useMemo(() => {
    const map = new Map();
    cities.forEach((city) => map.set(city.id, city));
    return map;
  }, [cities]);

  const stopLookup = useMemo(() => {
    const map = new Map();
    stops.forEach((stop) => {
      const city = cityLookup.get(stop.city_id);
      const label = city
        ? `${city.name}, ${city.country}`
        : `Stop ${stop.id}`;
      map.set(stop.id, label);
    });
    return map;
  }, [stops, cityLookup]);

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      const left = a.created_at ? Date.parse(a.created_at) : 0;
      const right = b.created_at ? Date.parse(b.created_at) : 0;
      return right - left;
    });
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (!filterStopId) {
      return sortedNotes;
    }
    return sortedNotes.filter((note) => note.stop_id === filterStopId);
  }, [sortedNotes, filterStopId]);

  const addMutation = useMutation({
    mutationFn: (payload) =>
      apiClient.post(`/notes/trips/${tripId}`, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notes", tripId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ noteId, payload }) =>
      apiClient.put(`/notes/${noteId}`, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notes", tripId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (noteId) => apiClient.delete(`/notes/${noteId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notes", tripId] }),
  });

  const resetForm = () => {
    setTitle("");
    setBody("");
    setNoteStopId("");
    setEditingNoteId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !tripId) {
      setStatusMessage("Trip and title are required.");
      return;
    }
    const payload = {
      title: trimmedTitle,
      body: body.trim(),
      stop_id: noteStopId || null,
    };
    setStatusMessage("");
    if (editingNoteId) {
      setPendingId(editingNoteId);
      updateMutation.mutate(
        { noteId: editingNoteId, payload },
        {
          onSuccess: () => {
            resetForm();
            setStatusMessage("Note updated.");
          },
          onSettled: () => setPendingId(null),
        },
      );
      return;
    }

    setPendingId("create");
    addMutation.mutate(payload, {
      onSuccess: () => {
        resetForm();
        setStatusMessage("Note added.");
      },
      onSettled: () => setPendingId(null),
    });
  };

  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setTitle(note.title || "");
    setBody(note.body || "");
    setNoteStopId(note.stop_id || "");
    setStatusMessage("");
  };

  const handleDelete = (noteId) => {
    const confirmDelete = window.confirm("Delete this note?");
    if (!confirmDelete) {
      return;
    }
    setPendingId(noteId);
    deleteMutation.mutate(noteId, {
      onSettled: () => setPendingId(null),
    });
  };

  const isBusy =
    addMutation.isLoading ||
    updateMutation.isLoading ||
    deleteMutation.isLoading;

  const selectedTrip = trips.find((trip) => trip.id === tripId);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            Trip journal
          </p>
          <h1 className="mt-2 text-3xl">Notes and reminders</h1>
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
          <select
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
            value={filterStopId || ""}
            onChange={(event) =>
              setFilterStopId(
                event.target.value ? Number(event.target.value) : "",
              )
            }
            disabled={!tripId || stopsLoading}
          >
            <option value="">All stops</option>
            {stops.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stopLookup.get(stop.id) || `Stop ${stop.id}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <form
          className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]"
          onSubmit={handleSubmit}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            {editingNoteId ? "Edit note" : "New note"}
          </p>
          <h2 className="mt-3 text-2xl">
            {selectedTrip ? selectedTrip.name : "Select a trip"}
          </h2>
          <p className="mt-2 text-sm text-[var(--slate)]">
            Capture reminders for the trip or a specific stop.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
                Title
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
                placeholder="Hotel check-in info"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
                Linked stop
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
                value={noteStopId || ""}
                onChange={(event) =>
                  setNoteStopId(
                    event.target.value ? Number(event.target.value) : "",
                  )
                }
                disabled={!tripId || stopsLoading}
              >
                <option value="">Trip-level note</option>
                {stops.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stopLookup.get(stop.id) || `Stop ${stop.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
                Note
              </label>
              <textarea
                className="mt-2 min-h-[140px] w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
                placeholder="Local contact, entry code, or daily reminder..."
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
            </div>
          </div>

          {statusMessage ? (
            <p className="mt-4 text-xs text-[var(--slate)]">{statusMessage}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="submit"
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                !tripId || isBusy
                  ? "cursor-not-allowed bg-[var(--border)] text-[var(--slate)]"
                  : "bg-[var(--indigo)] text-white"
              }`}
              disabled={!tripId || isBusy}
            >
              {editingNoteId ? "Save changes" : "Add note"}
            </button>
            {editingNoteId ? (
              <button
                type="button"
                className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--slate)]"
                onClick={resetForm}
                disabled={isBusy}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
                Notes list
              </p>
              <h2 className="mt-3 text-2xl">Recent notes</h2>
            </div>
            <span className="rounded-full bg-[var(--sand)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
              {filteredNotes.length} notes
            </span>
          </div>

          {notesLoading ? (
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--cream)]/50 p-4 text-sm text-[var(--slate)]">
              Loading notes...
            </div>
          ) : null}

          {!notesLoading && tripId && filteredNotes.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--cream)]/50 p-4 text-sm text-[var(--slate)]">
              No notes yet. Add your first reminder.
            </div>
          ) : null}

          {!tripId && !tripsLoading ? (
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--cream)]/50 p-4 text-sm text-[var(--slate)]">
              Select a trip to view notes.
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            {filteredNotes.map((note) => {
              const timestamp = note.created_at
                ? new Date(note.created_at).toLocaleString()
                : "Saved recently";
              const stopLabel = note.stop_id
                ? stopLookup.get(note.stop_id) || `Stop ${note.stop_id}`
                : "Trip-level";
              return (
                <div
                  key={note.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--cream)]/60 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--indigo)]">
                        {note.title}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
                        {stopLabel}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--slate)]">
                      {timestamp}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--slate)]">
                    {note.body || "No details added."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--slate)]"
                      onClick={() => handleEdit(note)}
                      disabled={isBusy}
                    >
                      Edit
                    </button>
                    <button
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        pendingId === note.id || isBusy
                          ? "cursor-not-allowed bg-[var(--border)] text-[var(--slate)]"
                          : "bg-white text-[var(--indigo)]"
                      }`}
                      onClick={() => handleDelete(note.id)}
                      disabled={pendingId === note.id || isBusy}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {notesFetching ? (
            <p className="mt-4 text-xs text-[var(--slate)]">Refreshing...</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
