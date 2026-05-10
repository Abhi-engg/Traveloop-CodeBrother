import TripCard from "../components/TripCard";

const trips = [
  { id: 1, name: "Portugal Loop", start_date: "Jun 12", end_date: "Jun 23" },
  { id: 2, name: "Tokyo Noir", start_date: "Aug 02", end_date: "Aug 12" },
];

const DashboardPage = () => {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-[var(--border)] bg-white p-8 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
          Home feed
        </p>
        <h1 className="mt-2 text-4xl">Your travel studio</h1>
        <p className="mt-3 max-w-xl text-sm text-[var(--slate)]">
          Build itineraries that feel like a magazine spread. Every stop,
          budget, and story in one place.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            "Create trip",
            "Invite friends",
            "Generate budget",
            "Share public link",
          ].map((label) => (
            <button
              key={label}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs uppercase tracking-[0.2em]"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Active trips</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
              View all
            </span>
          </div>
          <div className="grid gap-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            Next departure
          </p>
          <h3 className="mt-3 text-2xl">Lisbon in 9 days</h3>
          <p className="mt-2 text-sm text-[var(--slate)]">
            12 stops • 5 cities • $3,200 estimated spend
          </p>
          <div className="mt-6 rounded-2xl bg-[var(--sand)]/60 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Mood
            </p>
            <p className="mt-2 text-lg">Sunset chill + food crawl</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
