const items = [
  "Passport + cards",
  "Linen set",
  "Portable charger",
  "City sneakers",
  "Camera + lens",
  "Travel journal",
];

const PackingPage = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
          Packing list
        </p>
        <h2 className="mt-3 text-2xl">Portugal essentials</h2>
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 text-sm text-[var(--slate)]"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              {item}
            </label>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--sand)]/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
          Auto suggestions
        </p>
        <p className="mt-3 text-lg">Based on June weather & city stops</p>
        <ul className="mt-4 space-y-2 text-sm text-[var(--slate)]">
          <li>Light rain jacket</li>
          <li>Daypack</li>
          <li>Portable steamer</li>
        </ul>
      </div>
    </div>
  );
};

export default PackingPage;
