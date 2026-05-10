const stats = [
  { label: "Active trips", value: "1,240" },
  { label: "Shared links", value: "384" },
  { label: "Avg budget", value: "$2,940" },
  { label: "New users", value: "+128" },
];

const AdminPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
          Admin
        </p>
        <h1 className="mt-2 text-3xl">Traveloop analytics</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              {stat.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--indigo)]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
