const stops = [
  { city: "Lisbon", date: "Jun 12", mood: "Sunset stroll" },
  { city: "Porto", date: "Jun 15", mood: "Wine cellar" },
  { city: "Valencia", date: "Jun 18", mood: "Beach day" },
];

const ItineraryBuilder = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            Itinerary builder
          </p>
          <h1 className="mt-2 text-3xl">Shape each city</h1>
        </div>
        <button className="rounded-full border border-[var(--border)] px-4 py-2 text-xs uppercase tracking-[0.2em]">
          Auto-fill
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {stops.map((stop) => (
          <div
            key={stop.city}
            className="rounded-3xl border border-[var(--border)] bg-white p-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              {stop.date}
            </p>
            <h3 className="mt-2 text-2xl">{stop.city}</h3>
            <p className="mt-1 text-sm text-[var(--slate)]">{stop.mood}</p>
            <div className="mt-6 space-y-3">
              {[
                "Check-in boutique hotel",
                "Coffee crawl",
                "Golden hour photo walk",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-[var(--border)] bg-[var(--sand)]/40 px-3 py-2 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryBuilder;
