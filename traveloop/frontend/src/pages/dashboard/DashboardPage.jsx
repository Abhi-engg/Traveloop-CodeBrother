import { useDashboard } from "../../api/dashboard";
import {
  BudgetHighlights,
  RecentTrips,
  RecommendedCities,
  UpcomingTrip,
  WelcomeHero,
} from "./components";
import "./DashboardPage.css";

/**
 * DashboardPage — Central hub showing welcome message, recent trips,
 * upcoming trip, recommended destinations, and budget highlights.
 *
 * Fetches all data from a single aggregated /api/dashboard/ endpoint
 * for optimal performance.
 */
const DashboardPage = () => {
  const { data, isLoading, isError } = useDashboard();

  /* ── Loading State ─────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="dashboard" id="dashboard-loading">
        <div className="dash-skeleton dash-skeleton--hero" />
        <div className="dash-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="dash-skeleton dash-skeleton--card" />
            <div className="dash-skeleton dash-skeleton--card" />
            <div className="dash-skeleton dash-skeleton--card" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="dash-skeleton dash-skeleton--sidebar" />
            <div className="dash-skeleton dash-skeleton--sidebar" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Error State ───────────────────────────────────────── */
  if (isError) {
    return (
      <div className="dashboard" id="dashboard-error">
        <WelcomeHero
          username="Traveler"
          totalTrips={0}
          budgetSummary={{}}
          upcomingTrip={null}
        />
        <div className="dash-grid">
          <RecentTrips trips={[]} />
          <div className="dash-sidebar">
            <UpcomingTrip trip={null} />
            <RecommendedCities cities={[]} />
          </div>
        </div>
      </div>
    );
  }

  /* ── Success State ─────────────────────────────────────── */
  const {
    username = "Traveler",
    recent_trips = [],
    upcoming_trip = null,
    total_trips = 0,
    recommended_cities = [],
    budget_summary = {},
  } = data || {};

  return (
    <div className="dashboard" id="dashboard-page">
      {/* Hero Banner */}
      <WelcomeHero
        username={username}
        totalTrips={total_trips}
        budgetSummary={budget_summary}
        upcomingTrip={upcoming_trip}
      />

      {/* Main Content Grid */}
      <div className="dash-grid">
        {/* Left Column — Recent Trips */}
        <RecentTrips trips={recent_trips} />

        {/* Right Column — Sidebar Cards */}
        <div className="dash-sidebar">
          <UpcomingTrip trip={upcoming_trip} />
          <BudgetHighlights budgetSummary={budget_summary} />
          <RecommendedCities cities={recommended_cities} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
