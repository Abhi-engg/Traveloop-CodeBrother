const BudgetChart = ({
  totalSpent = 0,
  budgetTotal = 0,
  averagePerDay = 0,
  categoryBars = [],
}) => {
  const percentUsed =
    budgetTotal > 0 ? Math.min((totalSpent / budgetTotal) * 100, 999) : 0;
  const maxCategoryValue = Math.max(
    1,
    ...categoryBars.map((item) => item.amount || 0),
  );
  const showBudget = budgetTotal > 0;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            Budget runway
          </p>
          <h3 className="text-xl font-semibold">
            ${totalSpent.toFixed(0)}
            {showBudget ? ` / $${budgetTotal.toFixed(0)}` : ""}
          </h3>
          <p className="mt-2 text-xs text-[var(--slate)]">
            Avg per day ${averagePerDay.toFixed(0)}
          </p>
        </div>
        <span className="rounded-full bg-[var(--teal)]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--teal)]">
          {showBudget ? `${percentUsed.toFixed(0)}%` : "No budget"}
        </span>
      </div>
      <div className="mt-6 grid grid-cols-5 gap-3">
        {categoryBars.map((item) => (
          <div
            key={item.label}
            className="flex h-28 flex-col justify-end rounded-xl bg-[var(--sand)]/40 p-3"
          >
            <div
              className="rounded-lg bg-gradient-to-t from-[var(--coral)] to-[var(--coral-sun)]"
              style={{
                height: `${Math.max(
                  12,
                  (item.amount / maxCategoryValue) * 100,
                )}%`,
              }}
            />
            <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-[var(--slate)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetChart;
