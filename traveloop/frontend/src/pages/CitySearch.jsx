const cities = [
  { name: "Lisbon", country: "Portugal", vibe: "Pastel streets" },
  { name: "Seoul", country: "South Korea", vibe: "Neon + cafe" },
  { name: "Marrakesh", country: "Morocco", vibe: "Spice markets" },
  { name: "Reykjavik", country: "Iceland", vibe: "Aurora nights" },
];

const CitySearch = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            City search
          </p>
          <h1 className="mt-2 text-3xl">Discover destinations</h1>
        </div>
        <input
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
          placeholder="Search city"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cities.map((city) => (
          <div
            key={city.name}
            className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              {city.country}
            </p>
            <h3 className="mt-2 text-2xl">{city.name}</h3>
            <p className="mt-2 text-sm text-[var(--slate)]">{city.vibe}</p>
            <button className="mt-4 rounded-full bg-[var(--coral)] px-4 py-2 text-xs font-semibold text-white">
              Add to trip
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitySearch;
