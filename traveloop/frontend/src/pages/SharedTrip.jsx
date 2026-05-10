const SharedTrip = () => {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-[var(--border)] bg-white p-8 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
          Shared itinerary
        </p>
        <h1 className="mt-2 text-4xl">Portugal Loop</h1>
        <p className="mt-3 text-sm text-[var(--slate)]">
          12 days • 4 cities • curated by @traveloop
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Lisbon", "Porto", "Valencia"].map((city) => (
            <div
              key={city}
              className="rounded-2xl bg-[var(--sand)]/70 px-4 py-6 text-center"
            >
              <p className="text-lg">{city}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
                Stop
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--indigo)] p-6 text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          Make it yours
        </p>
        <p className="mt-3 text-lg">Copy this trip into your workspace.</p>
        <button className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[var(--indigo)]">
          Duplicate trip
        </button>
      </div>
    </div>
  );
};

export default SharedTrip;
