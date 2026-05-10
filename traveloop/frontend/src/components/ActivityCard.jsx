const ActivityCard = ({ activity }) => {
  if (!activity) {
    return null;
  }

  return (
    <article className="rounded-xl border border-[var(--border)] bg-white p-4">
      <div className="flex items-start justify-between">
        <h4 className="font-semibold text-[var(--indigo)]">{activity.name}</h4>
        <span className="rounded-full bg-[var(--lavender)]/20 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-[var(--indigo)]">
          {activity.category || "General"}
        </span>
      </div>
      <p className="mt-2 text-xs text-[var(--slate)]">
        Avg cost ${activity.avg_cost_usd || 40}
      </p>
    </article>
  );
};

export default ActivityCard;
