const TripCard = ({ trip }) => {
  if (!trip) {
    return null;
  }

  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{trip.name}</h3>
      <p className="text-sm text-slate-500">
        {trip.start_date} → {trip.end_date || "Open"}
      </p>
    </article>
  );
};

export default TripCard;
