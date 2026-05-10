import BudgetChart from "../components/BudgetChart";

const BudgetPage = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <BudgetChart />
      <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
          Breakdown
        </p>
        <h2 className="mt-3 text-2xl">Spend categories</h2>
        <div className="mt-6 space-y-4 text-sm text-[var(--slate)]">
          {[
            { label: "Stay", amount: "$1,120" },
            { label: "Food", amount: "$640" },
            { label: "Experiences", amount: "$420" },
            { label: "Transit", amount: "$160" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span>{item.label}</span>
              <span className="font-mono text-[var(--indigo)]">
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
