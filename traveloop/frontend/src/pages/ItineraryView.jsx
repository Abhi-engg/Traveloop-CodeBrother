const ItineraryView = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Calendar
            </p>
            <h2 className="mt-2 text-2xl">Portugal Loop</h2>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
            June 2026
          </span>
        </div>
        <div className="mt-6 grid grid-cols-7 gap-3 text-center text-xs">
          {Array.from({ length: 21 }).map((_, index) => (
            <div
              key={index}
              className={`rounded-xl border border-[var(--border)] p-3 ${
                index % 5 === 0 ? "bg-[var(--sand)]/70" : "bg-white"
              }`}
            >
              <p className="text-[var(--slate)]">{index + 6}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[var(--slate)]">
                {index % 5 === 0 ? "Stop" : ""}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            Highlights
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--slate)]">
            <li>Lisbon — Alfama sunset + rooftop dinner</li>
            <li>Porto — Douro wine cruise</li>
            <li>Valencia — Paella lab + bike tour</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--indigo)] p-6 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Share
          </p>
          <p className="mt-3 text-lg">traveloop.app/s/portugal-loop</p>
          <button className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[var(--indigo)]">
            Copy link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
