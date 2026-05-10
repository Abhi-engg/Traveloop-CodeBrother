const ProfilePage = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
          Profile
        </p>
        <h2 className="mt-3 text-2xl">Riya Sharma</h2>
        <p className="mt-2 text-sm text-[var(--slate)]">
          Solo traveler • Lisbon, Portugal
        </p>
        <div className="mt-6 grid gap-3">
          {["Email alerts", "Public sharing", "Budget reminders"].map(
            (item) => (
              <div
                key={item}
                className="rounded-xl border border-[var(--border)] p-3 text-sm"
              >
                {item}
              </div>
            ),
          )}
        </div>
      </div>
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--sand)]/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
          Preferences
        </p>
        <p className="mt-3 text-lg">Adventure + culture + cafe time</p>
        <button className="mt-4 rounded-full bg-[var(--indigo)] px-4 py-2 text-xs font-semibold text-white">
          Edit profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
