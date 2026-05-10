const BudgetChart = () => {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            Budget runway
          </p>
          <h3 className="text-xl font-semibold">$2,340 / $3,200</h3>
        </div>
        <span className="rounded-full bg-[var(--teal)]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--teal)]">
          73%
        </span>
      </div>
      <div className="mt-6 grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex h-28 flex-col justify-end rounded-xl bg-[var(--sand)]/40 p-3"
          >
            <div className="h-12 rounded-lg bg-gradient-to-t from-[var(--coral)] to-[var(--coral-sun)]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetChart;
