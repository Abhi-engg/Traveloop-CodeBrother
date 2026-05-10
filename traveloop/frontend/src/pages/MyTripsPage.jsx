import TripCard from "../components/TripCard";

const trips = [
  { id: 1, name: "Portugal Loop", start_date: "Jun 12", end_date: "Jun 23" },
  { id: 2, name: "Tokyo Noir", start_date: "Aug 02", end_date: "Aug 12" },
  {
    id: 3,
    name: "Mexico City Pulse",
    start_date: "Oct 05",
    end_date: "Oct 14",
  },
];

const MyTripsPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            My trips
          </p>
          <h1 className="mt-2 text-3xl">All itineraries</h1>
        </div>
        <button className="rounded-full bg-[var(--coral)] px-5 py-2 text-sm font-semibold text-white">
          New trip
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
};

export default MyTripsPage;
