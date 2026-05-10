const ActivityCard = ({
  activity,
  description,
  imageUrl,
  costLabel,
  durationLabel,
  costTier,
  isSelected,
  isBusy,
  onAdd,
  onRemove,
  actionLabel,
  actionDisabled,
}) => {
  if (!activity) {
    return null;
  }

  const handleAction = isSelected ? onRemove : onAdd;
  const label = actionLabel || (isSelected ? "Remove" : "Add");
  const isDisabled = actionDisabled || !handleAction || isBusy;

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow)]">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-32 w-full overflow-hidden rounded-xl bg-[var(--sand)] sm:h-28 sm:w-40">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${activity.name} preview`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Activity
            </div>
          )}
          {isSelected ? (
            <span className="absolute left-3 top-3 rounded-full bg-[var(--indigo)] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white">
              Added
            </span>
          ) : null}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h4 className="text-lg font-semibold text-[var(--indigo)]">
              {activity.name}
            </h4>
            <span className="rounded-full bg-[var(--lavender)]/20 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-[var(--indigo)]">
              {activity.category || "General"}
            </span>
          </div>
          <p className="mt-2 text-sm text-[var(--slate)]">
            {description || "Explore this experience and add it to your stop."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--slate)]">
            <span className="rounded-full bg-[var(--sand)] px-3 py-1">
              Cost {costLabel || "$40"}
            </span>
            <span className="rounded-full bg-[var(--lavender)]/20 px-3 py-1 text-[var(--indigo)]">
              {durationLabel || "Flexible"}
            </span>
            <span className="rounded-full bg-[var(--teal)]/10 px-3 py-1 text-[var(--teal)]">
              {costTier || "Mid"}
            </span>
          </div>
        </div>
        <div className="flex items-center sm:items-start">
          <button
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              isDisabled
                ? "cursor-not-allowed bg-[var(--border)] text-[var(--slate)]"
                : isSelected
                  ? "bg-white text-[var(--indigo)]"
                  : "bg-[var(--indigo)] text-white"
            }`}
            onClick={handleAction}
            disabled={isDisabled}
          >
            {isBusy ? "Working..." : label}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ActivityCard;
