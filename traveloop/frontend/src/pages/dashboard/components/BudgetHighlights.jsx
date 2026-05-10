/**
 * BudgetHighlights — Sidebar card showing overall budget summary
 * with estimated vs actual and category breakdown.
 */
const BudgetHighlights = ({ budgetSummary }) => {
  const { total_estimated = 0, total_actual = 0, category_breakdown = [] } =
    budgetSummary || {};

  const hasData = total_estimated > 0 || total_actual > 0;

  return (
    <div className="dash-budget" id="budget-highlights-card">
      <p className="dash-budget__label">Budget overview</p>
      <h3 className="dash-budget__title">
        {hasData ? "Spending Snapshot" : "No budget data yet"}
      </h3>

      <div className="dash-budget__amounts">
        <div className="dash-budget__amount dash-budget__amount--estimated">
          <p className="dash-budget__amount-label">Estimated</p>
          <p className="dash-budget__amount-value">
            ${Math.round(total_estimated).toLocaleString()}
          </p>
        </div>
        <div className="dash-budget__amount dash-budget__amount--actual">
          <p className="dash-budget__amount-label">Actual</p>
          <p className="dash-budget__amount-value">
            ${Math.round(total_actual).toLocaleString()}
          </p>
        </div>
      </div>

      {category_breakdown.length > 0 && (
        <div className="dash-budget__categories">
          {category_breakdown.map((cat, i) => (
            <div key={i} className="dash-budget__category">
              <span className="dash-budget__category-name">
                {cat.category || "Uncategorized"}
              </span>
              <span className="dash-budget__category-amount">
                ${Math.round(cat.total).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetHighlights;
