/**
 * TripPreviewCard — Live preview of the trip being created.
 * Updates in real-time as the user types into the form.
 */

const moodEmojis = {
  Relaxed: "🧘",
  Adventurous: "🏔️",
  Romantic: "💕",
  Cultural: "🏛️",
  Foodie: "🍜",
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return null;
  }
};

const calculateDays = (start, end) => {
  if (!start || !end) return null;
  try {
    const s = new Date(start + "T00:00:00");
    const e = new Date(end + "T00:00:00");
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  } catch {
    return null;
  }
};

const TripPreviewCard = ({ formData, coverPreviewUrl }) => {
  const { name, description, startDate, endDate, mood } = formData;

  const startFormatted = formatDate(startDate);
  const endFormatted = formatDate(endDate);
  const totalDays = calculateDays(startDate, endDate);

  return (
    <div className="trip-preview-card" id="trip-preview-card">
      <div className="trip-preview-card__gradient" />
      <div className="trip-preview-card__content">
        <p className="trip-preview-card__tag">Live Preview</p>

        <h2
          className={`trip-preview-card__name ${
            !name ? "trip-preview-card__name--placeholder" : ""
          }`}
        >
          {name || "Your Trip Name"}
        </h2>

        {(description || !name) && (
          <p
            className={`trip-preview-card__description ${
              !description
                ? "trip-preview-card__description--placeholder"
                : ""
            }`}
          >
            {description || "Add a description to make your trip memorable..."}
          </p>
        )}

        {coverPreviewUrl && (
          <img
            src={coverPreviewUrl}
            alt="Trip cover"
            className="trip-preview-card__cover"
          />
        )}

        <div className="trip-preview-card__meta">
          <div className="trip-preview-card__meta-item">
            <p className="trip-preview-card__meta-label">Starts</p>
            <p
              className={`trip-preview-card__meta-value ${
                !startFormatted
                  ? "trip-preview-card__meta-value--placeholder"
                  : ""
              }`}
            >
              {startFormatted || "Pick date"}
            </p>
          </div>
          <div className="trip-preview-card__meta-item">
            <p className="trip-preview-card__meta-label">Ends</p>
            <p
              className={`trip-preview-card__meta-value ${
                !endFormatted
                  ? "trip-preview-card__meta-value--placeholder"
                  : ""
              }`}
            >
              {endFormatted || "Pick date"}
            </p>
          </div>
          {totalDays && (
            <div className="trip-preview-card__meta-item">
              <p className="trip-preview-card__meta-label">Duration</p>
              <p className="trip-preview-card__meta-value">
                {totalDays} day{totalDays !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        {mood && (
          <div className="trip-preview-card__mood">
            <span>{moodEmojis[mood] || "✨"}</span>
            <span>{mood}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPreviewCard;
