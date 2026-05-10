import ActivityCard from "../components/ActivityCard";

const activities = [
  { name: "Tram 28 ride", category: "Culture", avg_cost_usd: 6 },
  { name: "Sunset mirador", category: "View", avg_cost_usd: 0 },
  { name: "Fado night", category: "Music", avg_cost_usd: 45 },
  { name: "Pastel workshop", category: "Food", avg_cost_usd: 30 },
];

const ActivitySearch = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            Activity search
          </p>
          <h1 className="mt-2 text-3xl">Pick your highlights</h1>
        </div>
        <input
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
          placeholder="Search activity"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {activities.map((activity) => (
          <ActivityCard key={activity.name} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default ActivitySearch;
