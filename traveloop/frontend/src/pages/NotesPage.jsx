const NotesPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
          Trip journal
        </p>
        <h1 className="mt-2 text-3xl">Notes + memories</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Lisbon, day 2",
            body: "Golden hour in Alfama, found a tiny fado bar.",
          },
          {
            title: "Porto morning",
            body: "Cafe hopping along the river. Best espresso yet.",
          },
        ].map((note) => (
          <div
            key={note.title}
            className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]"
          >
            <h3 className="text-xl">{note.title}</h3>
            <p className="mt-3 text-sm text-[var(--slate)]">{note.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
