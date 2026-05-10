import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const categoryData = [
  { name: "Lodging", value: 12000, color: "#4F46E5" },
  { name: "Food", value: 6500, color: "#ff6b47" },
  { name: "Transport", value: 8500, color: "#10B981" },
  { name: "Activities", value: 5200, color: "#F59E0B" },
  { name: "Shopping", value: 3800, color: "#8B5CF6" },
];

const cityData = [
  { name: "Jaipur", spent: 15200, budget: 15000 },
  { name: "Udaipur", spent: 11000, budget: 12000 },
  { name: "Jodhpur", spent: 9800, budget: 11000 },
];

const TOTAL_BUDGET = 38000;

const BudgetPage = () => {
  const [spent, setSpent] = useState(0);
  const [isOverBudget, setIsOverBudget] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Animate the numbers counting up
  useEffect(() => {
    const totalSpent = categoryData.reduce((acc, curr) => acc + curr.value, 0);
    let current = 0;
    const step = totalSpent / 50;
    const interval = setInterval(() => {
      current += step;
      if (current >= totalSpent) {
        setSpent(totalSpent);
        clearInterval(interval);
        if (totalSpent > TOTAL_BUDGET) {
          setIsOverBudget(true);
          // Flash warning
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 2000);
        }
      } else {
        setSpent(current);
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{payload[0].name}</p>
          <p className="text-sm font-semibold" style={{ color: payload[0].payload.color }}>
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] p-6 md:p-10 transition-colors duration-1000 ${showWarning ? 'bg-red-50 dark:bg-red-950/30' : 'bg-[var(--cream)] dark:bg-gray-950'}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <Link to="/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[var(--indigo)] dark:text-gray-400 dark:hover:text-indigo-400 mb-4 inline-flex items-center gap-2">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-[var(--indigo)] dark:text-white mt-2">Rajasthan Royal Route</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Budget Tracker & Cost Breakdown</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-shadow dark:text-white">
               Add Expense
             </button>
             <button className="px-5 py-2.5 bg-[var(--indigo)] text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 transition-transform">
               Connect Bank
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
          
          {/* Left Column: Total & Breakdown */}
          <div className="space-y-8">
            
            {/* Total Card */}
            <div className={`relative overflow-hidden rounded-[2rem] p-8 shadow-2xl transition-all duration-500 ${isOverBudget ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-[var(--indigo)] to-indigo-800'}`}>
               <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="relative z-10 text-white">
                 <div className="flex justify-between items-start mb-6">
                   <p className="text-sm font-bold uppercase tracking-widest opacity-80">
                     Total Spent
                   </p>
                   {isOverBudget && (
                     <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                       Over Budget
                     </span>
                   )}
                 </div>
                 
                 <h2 className="text-6xl font-black mb-2 tracking-tight">
                   ₹{Math.round(spent).toLocaleString()}
                 </h2>
                 <p className="text-sm opacity-80 font-medium">
                   of ₹{TOTAL_BUDGET.toLocaleString()} budget
                 </p>
                 
                 <div className="mt-8">
                   <div className="w-full bg-black/20 rounded-full h-2 mb-2 overflow-hidden backdrop-blur-sm">
                     <div 
                       className={`h-full rounded-full transition-all duration-1000 ${isOverBudget ? 'bg-white' : 'bg-[#ff6b47]'}`}
                       style={{ width: `${Math.min((spent / TOTAL_BUDGET) * 100, 100)}%` }}
                     />
                   </div>
                   <p className="text-xs opacity-70 text-right">
                     {Math.round((spent / TOTAL_BUDGET) * 100)}% Consumed
                   </p>
                 </div>
               </div>
            </div>

            {/* List Breakdown */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
               <h3 className="text-lg font-bold text-[var(--indigo)] dark:text-white mb-6">Categories</h3>
               <div className="space-y-4">
                 {categoryData.map((cat, i) => (
                   <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }}></div>
                       <span className="font-semibold text-gray-700 dark:text-gray-300">{cat.name}</span>
                     </div>
                     <div className="flex items-center gap-4">
                       <span className="text-xs text-gray-400 font-medium">{Math.round((cat.value / 36000) * 100)}%</span>
                       <span className="font-mono font-bold text-gray-900 dark:text-white w-20 text-right">₹{cat.value.toLocaleString()}</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Column: Charts */}
          <div className="space-y-8">
            
            {/* Donut Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center">
               <h3 className="text-lg font-bold text-[var(--indigo)] dark:text-white self-start w-full mb-2">Visual Breakdown</h3>
               <div className="w-full h-[300px] relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={categoryData}
                       cx="50%"
                       cy="50%"
                       innerRadius={80}
                       outerRadius={110}
                       paddingAngle={5}
                       dataKey="value"
                       stroke="none"
                     >
                       {categoryData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <Tooltip content={<CustomTooltip />} />
                   </PieChart>
                 </ResponsiveContainer>
                 {/* Center Text */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{Math.round(spent).toLocaleString()}</span>
                   <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Spent</span>
                 </div>
               </div>
            </div>

            {/* City Bar Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
               <h3 className="text-lg font-bold text-[var(--indigo)] dark:text-white mb-6">Spend by City</h3>
               <div className="w-full h-[250px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={cityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} />
                     <Tooltip 
                       cursor={{ fill: 'transparent' }}
                       content={({ active, payload }) => {
                         if (active && payload && payload.length) {
                           return (
                             <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
                               <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{payload[0].payload.name}</p>
                               <p className="text-xs font-medium text-emerald-500 mb-1">Budget: ₹{payload[0].payload.budget.toLocaleString()}</p>
                               <p className="text-xs font-medium text-[var(--indigo)] dark:text-indigo-400">Spent: ₹{payload[0].value.toLocaleString()}</p>
                             </div>
                           );
                         }
                         return null;
                       }}
                     />
                     <Bar dataKey="spent" radius={[6, 6, 6, 6]}>
                       {cityData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.spent > entry.budget ? '#ef4444' : '#4F46E5'} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
