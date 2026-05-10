/**
 * UpcomingTrip — Sidebar card highlighting the user's next trip.
 */

const moodEmojis = {
  Relaxed: "🧘",
  Adventurous: "🏔️",
  Romantic: "💕",
  Cultural: "🏛️",
  Foodie: "🍜",
};

const getDaysUntil = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Departing today!";
  if (diff === 1) return "Departing tomorrow!";
  if (diff < 0) return "Trip in progress";
  return `${diff} days to go`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const UpcomingTrip = ({ trip }) => {
  if (!trip) {
    return (
      <div className="dash-upcoming" id="upcoming-trip-card">
        <p className="dash-upcoming__label">Next Departure</p>
        <h3 className="dash-upcoming__title">No upcoming trips</h3>
        <p className="dash-upcoming__details">
          Create a new trip to see your next adventure here.
        </p>
      </div>
    );
  }

  const countdown = getDaysUntil(trip.start_date);

  return (
    <div className="dash-upcoming" id="upcoming-trip-card">
      <p className="dash-upcoming__label">Next Departure</p>
      <h3 className="dash-upcoming__title">{trip.name}</h3>

      {countdown && (
        <div className="dash-upcoming__countdown">
          <span>⏰</span>
          <span>{countdown}</span>
        </div>
      )}

      <p className="dash-upcoming__details">
        {formatDate(trip.start_date)}
        {trip.end_date ? ` — ${formatDate(trip.end_date)}` : ""}
        {trip.budget_total > 0 && (
          <>
            <br />
            Budget: <strong>${trip.budget_total.toLocaleString()}</strong>
          </>
        )}
      </p>

      {trip.mood_tag && (
        <div className="dash-upcoming__mood">
          <span>{moodEmojis[trip.mood_tag] || "✨"}</span>
          <span>{trip.mood_tag} vibes</span>
        </div>
      )}
    </div>
  );
};

export default UpcomingTrip;
