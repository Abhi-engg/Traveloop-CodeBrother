const TripCard = ({ trip }) => {
  if (!trip) {
    return null;
  }

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow)]">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{trip.name}</h3>
        <span className="rounded-full bg-[var(--sand)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
          {trip.visibility || "private"}
        </span>
      </div>
      <p className="mt-2 text-sm text-[var(--slate)]">
        {trip.start_date} → {trip.end_date || "Open"}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-[var(--slate)]">
        <span>Stops: {trip.stops || 4}</span>
        <span className="font-mono">${trip.budget_total || 2400}</span>
      </div>
    </article>
  );
};

export default TripCard;
