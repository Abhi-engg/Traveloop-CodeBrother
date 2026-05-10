import { useEffect, useMemo, useState } from "react";
import BudgetChart from "../components/BudgetChart";
import { useBudget } from "../hooks/useBudget";
import { useStops } from "../hooks/useStops";
import { useTrips } from "../hooks/useTrips";

const CATEGORY_ORDER = [
  "Stay",
  "Transport",
  "Activities",
  "Meals",
  "Other",
];

const CATEGORY_COLORS = [
  "#ff6b47",
  "#38b2ac",
  "#a78bfa",
  "#ffb347",
  "#1a1035",
];

const toCurrency = (value) => `$${Number(value || 0).toFixed(0)}`;

const parseDate = (value) => (value ? new Date(`${value}T00:00:00`) : null);

const buildDateRange = (start, end) => {
  if (!start || !end) {
    return [];
  }
  const days = [];
  const current = new Date(start.getTime());
  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    days.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const mapCategory = (value) => {
  const normalized = (value || "").toLowerCase();
  if (normalized.includes("stay") || normalized.includes("hotel")) {
    return "Stay";
  }
  if (
    normalized.includes("transport") ||
    normalized.includes("flight") ||
    normalized.includes("train") ||
    normalized.includes("taxi") ||
    normalized.includes("bus") ||
    normalized.includes("transit")
  ) {
    return "Transport";
  }
  if (
    normalized.includes("activity") ||
    normalized.includes("experience") ||
    normalized.includes("tour") ||
    normalized.includes("ticket")
  ) {
    return "Activities";
  }
  if (
    normalized.includes("meal") ||
    normalized.includes("food") ||
    normalized.includes("dining") ||
    normalized.includes("restaurant") ||
    normalized.includes("cafe")
  ) {
    return "Meals";
  }
  return "Other";
};

const BudgetPage = () => {
  const { data: trips = [], isLoading: tripsLoading } = useTrips();
  const [tripId, setTripId] = useState("");

  useEffect(() => {
    if (!tripId && trips.length) {
      setTripId(trips[0].id);
    }
  }, [tripId, trips]);

  const { data: budgetItems = [], isLoading: budgetLoading } =
    useBudget(tripId);
  const { data: stops = [] } = useStops(tripId);

  const selectedTrip = trips.find((trip) => trip.id === tripId);
  const budgetTotal = Number(selectedTrip?.budget_total || 0);
  const tripStart = parseDate(selectedTrip?.start_date);
  const tripEnd = parseDate(selectedTrip?.end_date || selectedTrip?.start_date);
  const tripDates = useMemo(
    () => buildDateRange(tripStart, tripEnd),
    [tripStart, tripEnd],
  );
  const tripDays = Math.max(tripDates.length, 0);

  const totals = useMemo(() => {
    let estimated = 0;
    let actual = 0;
    budgetItems.forEach((item) => {
      const amount = Number(item.amount) || 0;
      if (item.is_estimated) {
        estimated += amount;
      } else {
        actual += amount;
      }
    });
    return { estimated, actual };
  }, [budgetItems]);

  const totalSpent = totals.actual > 0 ? totals.actual : totals.estimated;
  const averagePerDay = tripDays ? totalSpent / tripDays : 0;

  const categoryTotals = useMemo(() => {
    const bucket = {
      Stay: 0,
      Transport: 0,
      Activities: 0,
      Meals: 0,
      Other: 0,
    };
    budgetItems.forEach((item) => {
      const amount = Number(item.amount) || 0;
      const category = mapCategory(item.category);
      bucket[category] += amount;
    });
    return CATEGORY_ORDER.map((label) => ({ label, amount: bucket[label] }));
  }, [budgetItems]);

  const stopDateLookup = useMemo(() => {
    const map = new Map();
    stops.forEach((stop) => {
      const arrival = parseDate(stop.arrival_date);
      const departure = parseDate(stop.departure_date || stop.arrival_date);
      map.set(stop.id, { arrival, departure });
    });
    return map;
  }, [stops]);

  const dailySpend = useMemo(() => {
    const map = new Map();
    tripDates.forEach((date) => map.set(date, 0));
    if (!tripDates.length) {
      return { map, hasDates: false };
    }

    budgetItems.forEach((item) => {
      const amount = Number(item.amount) || 0;
      if (!amount) {
        return;
      }
      let range = tripDates;
      if (item.stop_id && stopDateLookup.has(item.stop_id)) {
        const { arrival, departure } = stopDateLookup.get(item.stop_id);
        const stopRange = buildDateRange(arrival, departure);
        if (stopRange.length) {
          range = stopRange;
        }
      }
      const perDay = amount / range.length;
      range.forEach((date) => {
        map.set(date, (map.get(date) || 0) + perDay);
      });
    });

    return { map, hasDates: true };
  }, [budgetItems, tripDates, stopDateLookup]);

  const dailyBudget = tripDays && budgetTotal ? budgetTotal / tripDays : 0;
  const overBudgetDays = useMemo(() => {
    if (!dailyBudget || !dailySpend.hasDates) {
      return [];
    }
    const results = [];
    dailySpend.map.forEach((amount, date) => {
      if (amount > dailyBudget) {
        results.push({ date, amount });
      }
    });
    return results.sort((a, b) => b.amount - a.amount);
  }, [dailySpend, dailyBudget]);

  const totalBreakdown = categoryTotals.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const pieSegments = useMemo(() => {
    if (!totalBreakdown) {
      return "var(--sand)";
    }
    let current = 0;
    return categoryTotals
      .map((item, index) => {
        const portion = (item.amount / totalBreakdown) * 360;
        const start = current;
        const end = current + portion;
        current = end;
        const color = CATEGORY_COLORS[index] || "#1a1035";
        return `${color} ${start}deg ${end}deg`;
      })
      .join(", ");
  }, [categoryTotals, totalBreakdown]);

  const showBudgetNotice = !budgetTotal && totalSpent > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            Trip budget
          </p>
          <h1 className="mt-2 text-3xl">Budget and cost breakdown</h1>
        </div>
        <select
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
          value={tripId || ""}
          onChange={(event) =>
            setTripId(event.target.value ? Number(event.target.value) : "")
          }
          disabled={tripsLoading}
        >
          <option value="">Select trip</option>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.name}
            </option>
          ))}
        </select>
      </div>

      {!tripsLoading && trips.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--slate)]">
          Create a trip to start tracking costs.
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <BudgetChart
            totalSpent={totalSpent}
            budgetTotal={budgetTotal || totalSpent}
            averagePerDay={averagePerDay}
            categoryBars={categoryTotals}
          />

          <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Overview
            </p>
            <div className="mt-4 grid gap-4 text-sm text-[var(--slate)] md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--cream)]/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em]">Estimated</p>
                <p className="mt-2 text-xl font-semibold text-[var(--indigo)]">
                  {toCurrency(totals.estimated)}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--cream)]/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em]">Actual</p>
                <p className="mt-2 text-xl font-semibold text-[var(--indigo)]">
                  {toCurrency(totals.actual)}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--cream)]/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em]">Avg per day</p>
                <p className="mt-2 text-xl font-semibold text-[var(--indigo)]">
                  {tripDays ? toCurrency(averagePerDay) : "n/a"}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--cream)]/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em]">Trip days</p>
                <p className="mt-2 text-xl font-semibold text-[var(--indigo)]">
                  {tripDays || "n/a"}
                </p>
              </div>
            </div>
            {showBudgetNotice ? (
              <p className="mt-4 text-xs text-[var(--slate)]">
                Set a trip budget to enable precise runway alerts.
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Breakdown
            </p>
            <h2 className="mt-3 text-2xl">Spend categories</h2>
            <div className="mt-5 flex flex-wrap items-center gap-6">
              <div
                className="h-32 w-32 rounded-full border border-[var(--border)]"
                style={{ background: `conic-gradient(${pieSegments})` }}
              />
              <div className="space-y-3 text-sm text-[var(--slate)]">
                {categoryTotals.map((item, index) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[index] }}
                      />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-mono text-[var(--indigo)]">
                      {toCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Alerts
            </p>
            <h2 className="mt-3 text-2xl">Over budget days</h2>
            {!tripDates.length ? (
              <p className="mt-4 text-sm text-[var(--slate)]">
                Add trip dates to see daily budget alerts.
              </p>
            ) : !budgetTotal ? (
              <p className="mt-4 text-sm text-[var(--slate)]">
                Set a trip budget to enable alerts.
              </p>
            ) : overBudgetDays.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--slate)]">
                No days over budget yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3 text-sm text-[var(--slate)]">
                {overBudgetDays.slice(0, 5).map((day) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--cream)]/60 px-4 py-3"
                  >
                    <span>{day.date}</span>
                    <span className="font-mono text-[var(--indigo)]">
                      {toCurrency(day.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {budgetLoading ? (
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6 text-sm text-[var(--slate)]">
          Loading budget items...
        </div>
      ) : null}
    </div>
  );
};

export default BudgetPage;
