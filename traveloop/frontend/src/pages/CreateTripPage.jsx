import { useState } from "react";
import MoodPicker from "../components/MoodPicker";

const CreateTripPage = () => {
  const [mood, setMood] = useState("Relaxed");

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-[var(--border)] bg-white p-8 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
          Create trip
        </p>
        <h1 className="mt-2 text-3xl">Build a new loop</h1>
        <div className="mt-6 grid gap-4">
          {[
            { label: "Trip name", placeholder: "Mediterranean Escape" },
            { label: "Start date", placeholder: "2026-06-12" },
            { label: "End date", placeholder: "2026-06-26" },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
                {field.label}
              </label>
              <input
                className="mt-2 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            Mood
          </p>
          <div className="mt-3">
            <MoodPicker value={mood} onChange={setMood} />
          </div>
        </div>
        <button className="mt-8 rounded-full bg-[var(--indigo)] px-6 py-3 text-sm font-semibold text-white">
          Create trip
        </button>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--indigo)] p-6 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Preview
          </p>
          <h2 className="mt-3 text-2xl">Mediterranean Escape</h2>
          <p className="mt-2 text-sm text-white/70">
            Coral coast, vineyards, late-night tapas.
          </p>
          <div className="mt-6 rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Stops
            </p>
            <p className="mt-2 text-lg">
              Lisbon → Porto → Valencia → Barcelona
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            Auto budget
          </p>
          <p className="mt-2 text-lg">$3,200 estimate</p>
          <p className="mt-2 text-sm text-[var(--slate)]">
            Based on 4 cities, 12 days, mid-range stay.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateTripPage;
