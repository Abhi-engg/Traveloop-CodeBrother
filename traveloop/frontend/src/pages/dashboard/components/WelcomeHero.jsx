import { Link } from "react-router-dom";

/**
 * WelcomeHero — Main hero banner with welcome message,
 * quick stats, and action buttons.
 */
const WelcomeHero = ({ username, totalTrips, budgetSummary, upcomingTrip }) => {
  const displayName = username
    ? username.charAt(0).toUpperCase() + username.slice(1)
    : "Traveler";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <section className="dash-hero" id="dashboard-hero">
      <div className="dash-hero__gradient" />
      <div className="dash-hero__content">
        <p className="dash-hero__greeting">{getGreeting()}</p>
        <h1 className="dash-hero__title">
          Welcome back, {displayName} ✨
        </h1>
        <p className="dash-hero__subtitle">
          Build itineraries that feel like a magazine spread. Every stop,
          budget, and story in one place.
        </p>

        {/* Quick Actions */}
        <div className="dash-actions">
          <Link to="/trips/new" className="dash-action-btn dash-action-btn--primary" id="dash-new-trip-btn">
            🚀 Plan New Trip
          </Link>
          <Link to="/trips" className="dash-action-btn dash-action-btn--secondary" id="dash-my-trips-btn">
            📋 My Trips
          </Link>
          <Link to="/search/cities" className="dash-action-btn dash-action-btn--secondary">
            🌍 Explore Cities
          </Link>
        </div>

        {/* Stats Row */}
        <div className="dash-stats">
          <div className="dash-stat">
            <p className="dash-stat__label">Total Trips</p>
            <p className="dash-stat__value">{totalTrips}</p>
          </div>
          <div className="dash-stat">
            <p className="dash-stat__label">Next Trip</p>
            <p className="dash-stat__value">
              {upcomingTrip ? getDaysUntil(upcomingTrip.start_date) : "—"}
            </p>
          </div>
          <div className="dash-stat">
            <p className="dash-stat__label">Estimated</p>
            <p className="dash-stat__value">
              ${Math.round(budgetSummary?.total_estimated || 0).toLocaleString()}
            </p>
          </div>
          <div className="dash-stat">
            <p className="dash-stat__label">Spent</p>
            <p className="dash-stat__value">
              ${Math.round(budgetSummary?.total_actual || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

/** Calculate "X days" label until a date string */
function getDaysUntil(dateStr) {
  if (!dateStr) return "—";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today!";
  if (diff === 1) return "Tomorrow";
  if (diff < 0) return "Ongoing";
  return `${diff} days`;
}

export default WelcomeHero;
