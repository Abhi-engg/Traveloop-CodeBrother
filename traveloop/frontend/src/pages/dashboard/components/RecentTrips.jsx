import { Link } from "react-router-dom";

/**
 * RecentTrips — List of the user's most recent trips with status badges.
 */

const moodEmojis = {
  Relaxed: "🧘",
  Adventurous: "🏔️",
  Romantic: "💕",
  Cultural: "🏛️",
  Foodie: "🍜",
};

const coverColors = [
  "linear-gradient(135deg, rgba(255,107,71,0.12), rgba(255,179,71,0.12))",
  "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(56,178,172,0.12))",
  "linear-gradient(135deg, rgba(56,178,172,0.12), rgba(167,139,250,0.12))",
  "linear-gradient(135deg, rgba(255,179,71,0.12), rgba(255,107,71,0.12))",
  "linear-gradient(135deg, rgba(245,230,200,0.5), rgba(255,143,107,0.12))",
];

const coverIcons = ["✈️", "🌴", "🏖️", "🗺️", "🧳"];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
};

const getTripStatus = (startDate, endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate + "T00:00:00");
  const end = endDate ? new Date(endDate + "T00:00:00") : null;

  if (start > today) return "upcoming";
  if (end && end < today) return "past";
  return "active";
};

const RecentTrips = ({ trips = [] }) => {
  return (
    <div>
      <div className="dash-section-header">
        <h2 className="dash-section-title">Recent Trips</h2>
        <Link to="/trips" className="dash-section-link" id="view-all-trips-link">
          View all →
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="dash-empty" id="no-trips-empty-state">
          <span className="dash-empty__icon">🗺️</span>
          <h3 className="dash-empty__title">No trips yet</h3>
          <p className="dash-empty__text">
            Start planning your first adventure — it only takes a minute!
          </p>
          <Link to="/trips/new" className="dash-empty__btn" id="empty-create-trip-btn">
            🚀 Create First Trip
          </Link>
        </div>
      ) : (
        <div className="dash-trips-grid" id="recent-trips-list">
          {trips.map((trip, index) => {
            const status = getTripStatus(trip.start_date, trip.end_date);
            return (
              <article key={trip.id} className="dash-trip-card" id={`trip-card-${trip.id}`}>
                {/* Cover thumbnail */}
                {trip.cover_photo ? (
                  <img
                    src={trip.cover_photo}
                    alt={trip.name}
                    className="dash-trip-card__cover"
                  />
                ) : (
                  <div
                    className="dash-trip-card__cover--placeholder"
                    style={{ background: coverColors[index % coverColors.length] }}
                  >
                    {coverIcons[index % coverIcons.length]}
                  </div>
                )}

                {/* Trip info */}
                <div className="dash-trip-card__info">
                  <h3 className="dash-trip-card__name">{trip.name}</h3>
                  <p className="dash-trip-card__meta">
                    {formatDate(trip.start_date)}
                    {trip.end_date ? ` → ${formatDate(trip.end_date)}` : ""}
                    {trip.mood_tag ? ` • ${moodEmojis[trip.mood_tag] || "✨"} ${trip.mood_tag}` : ""}
                  </p>
                </div>

                {/* Status badge */}
                <span className={`dash-trip-card__badge dash-trip-card__badge--${status}`}>
                  {status}
                </span>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTrips;
