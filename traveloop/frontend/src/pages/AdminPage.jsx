import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import {
  adminUserGrowth, adminTopCities, adminTopActivities,
  adminRecentUsers, adminKPIs
} from "../data/mockData";

/* ── tiny helpers ─────────────────────────────────────── */
const fmt = (n) => n.toLocaleString();
const badge = (status) => {
  const map = {
    active:    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    idle:      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    suspended: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  };
  return map[status] ?? map.idle;
};

/* ── KPI Card ─────────────────────────────────────────── */
const KpiCard = ({ label, value, growth, icon, accent }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:shadow-xl transition-shadow group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${accent}`}>
        {icon}
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${growth >= 0 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
        {growth >= 0 ? "↑" : "↓"} {Math.abs(growth)}%
      </span>
    </div>
    <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-1">{label}</p>
  </div>
);

/* ── Main Page ────────────────────────────────────────── */
const AdminPage = () => {
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen bg-[var(--cream)] dark:bg-gray-950 transition-colors pb-20 lg:pb-0">

      {/* ─── Header ──────────────────────────────────── */}
      <header className="px-6 py-8 md:px-12 md:py-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <Link to="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[var(--indigo)] dark:hover:text-indigo-400 mb-3 inline-flex items-center gap-2 transition-colors">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[var(--indigo)] dark:text-white mt-1">Admin Analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform performance &amp; user insights</p>
          </div>

          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {["overview", "users", "content"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${tab === t ? "bg-white dark:bg-gray-700 text-[var(--indigo)] dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-6 py-10 md:px-12 max-w-7xl mx-auto space-y-10">

        {/* ─── KPI Grid ─────────────────────────────── */}
        <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard label="Total Users"   value={fmt(adminKPIs.totalUsers)}  growth={adminKPIs.userGrowth}    icon="👥" accent="bg-indigo-50 dark:bg-indigo-900/30" />
          <KpiCard label="Active Trips"  value={fmt(adminKPIs.activeTrips)} growth={adminKPIs.tripGrowth}    icon="✈️" accent="bg-blue-50 dark:bg-blue-900/30" />
          <KpiCard label="Shared Links"  value={fmt(adminKPIs.sharedLinks)} growth={adminKPIs.shareGrowth}   icon="🔗" accent="bg-purple-50 dark:bg-purple-900/30" />
          <KpiCard label="Avg Budget"    value={`₹${fmt(adminKPIs.avgBudget)}`} growth={adminKPIs.budgetGrowth} icon="💰" accent="bg-amber-50 dark:bg-amber-900/30" />
          <KpiCard label="Revenue"       value={`₹${fmt(adminKPIs.totalRevenue)}`} growth={adminKPIs.revenueGrowth} icon="📈" accent="bg-emerald-50 dark:bg-emerald-900/30" />
          <KpiCard label="Avg Session"   value={`${adminKPIs.avgSessionMin}m`} growth={adminKPIs.sessionGrowth} icon="⏱️" accent="bg-rose-50 dark:bg-rose-900/30" />
        </section>

        {/* ─── Charts Row ───────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">

          {/* User Growth Area Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[var(--indigo)] dark:text-white">User Growth</h3>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">Last 7 months</span>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={adminUserGrowth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} dx={-10} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 10px 25px -5px rgba(0,0,0,.1)" }}
                    labelStyle={{ fontWeight: 700 }}
                    formatter={(v) => [fmt(v), "Users"]}
                  />
                  <Area type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={3} fill="url(#userGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Cities Bar Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-[var(--indigo)] dark:text-white mb-6">Popular Cities</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminTopCities.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#374151", fontSize: 12, fontWeight: 600 }} width={80} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 10px 25px -5px rgba(0,0,0,.1)" }}
                    formatter={(v) => [v, "Trips"]}
                  />
                  <Bar dataKey="trips" radius={[0, 6, 6, 0]} barSize={18}>
                    {adminTopCities.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={["#4F46E5", "#ff6b47", "#10B981", "#8B5CF6", "#F59E0B", "#06B6D4"][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ─── Tables Row ───────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">

          {/* Recent Users Table */}
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[var(--indigo)] dark:text-white">Recent Users</h3>
              <button className="text-xs font-bold text-[var(--indigo)] dark:text-indigo-400 hover:underline">View all →</button>
            </div>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left py-3 px-2 text-xs font-bold uppercase tracking-widest text-gray-400">User</th>
                    <th className="text-left py-3 px-2 text-xs font-bold uppercase tracking-widest text-gray-400">Joined</th>
                    <th className="text-center py-3 px-2 text-xs font-bold uppercase tracking-widest text-gray-400">Trips</th>
                    <th className="text-center py-3 px-2 text-xs font-bold uppercase tracking-widest text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminRecentUsers.map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">{u.joinDate}</td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-gray-700 dark:text-gray-300">{u.trips}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${badge(u.status)}`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Activities Table */}
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[var(--indigo)] dark:text-white">Top Activities</h3>
              <button className="text-xs font-bold text-[var(--indigo)] dark:text-indigo-400 hover:underline">View all →</button>
            </div>
            <div className="space-y-3">
              {adminTopActivities.map((a, i) => (
                <div key={a.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--indigo)] to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-gray-700 dark:text-gray-300">{fmt(a.bookings)}</p>
                    <p className="text-xs text-gray-400 flex items-center justify-end gap-1">
                      <span className="text-amber-400">★</span> {a.rating}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── City Leaderboard ─────────────────────── */}
        <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-[var(--indigo)] dark:text-white mb-6">City Leaderboard</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminTopCities.map((c, i) => (
              <div key={c.name} className="relative overflow-hidden rounded-2xl p-5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group">
                {i < 3 && (
                  <div className="absolute top-3 right-3 text-2xl">
                    {["🥇", "🥈", "🥉"][i]}
                  </div>
                )}
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{c.name}</p>
                <p className="text-2xl font-black text-[var(--indigo)] dark:text-indigo-400">{c.trips}</p>
                <p className="text-xs text-gray-400 mt-1">trips created</p>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[var(--indigo)] h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${(c.trips / adminTopCities[0].trips) * 100}%` }}
                    />
                  </div>
                </div>
                <span className={`inline-block mt-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${c.growth >= 0 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {c.growth >= 0 ? "↑" : "↓"} {Math.abs(c.growth)}% this month
                </span>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default AdminPage;
