import React, { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Sparkles, RefreshCw, IndianRupee } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { generateInsights } from '../services/geminiService';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Financial Summaries
  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      income,
      expense,
      balance: income - expense
    };
  }, [transactions]);

  // Chart Data: Expenses by Category
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (b.value as number) - (a.value as number));
  }, [transactions]);

  // Chart Data: Last 6 Months Activity
  const activityData = useMemo(() => {
    const today = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      return d.toLocaleString('default', { month: 'short' });
    }).reverse();

    return last6Months.map(month => {
      const income = transactions
        .filter(t => t.type === TransactionType.INCOME && new Date(t.date).toLocaleString('default', { month: 'short' }) === month)
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = transactions
        .filter(t => t.type === TransactionType.EXPENSE && new Date(t.date).toLocaleString('default', { month: 'short' }) === month)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return { name: month, Income: income, Expense: expense };
    });
  }, [transactions]);

  const handleGenerateInsights = async () => {
    setLoadingInsights(true);
    const result = await generateInsights(transactions);
    setInsights(result);
    setLoadingInsights(false);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-lg shadow-blue-50/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-50"></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Wallet size={20} />
            </div>
            <span className="text-sm font-semibold text-slate-500">Total Balance</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 flex items-center gap-1 relative z-10">
            <IndianRupee size={22} />{summary.balance.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg shadow-emerald-50/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 opacity-50"></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm font-semibold text-slate-500">Total Income</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 flex items-center gap-1 relative z-10">
            +<IndianRupee size={22} />{summary.income.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg shadow-orange-50/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 opacity-50"></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-orange-100 text-orange-700 rounded-lg">
              <TrendingDown size={20} />
            </div>
            <span className="text-sm font-semibold text-slate-500">Total Expenses</span>
          </div>
          <p className="text-2xl font-bold text-orange-600 flex items-center gap-1 relative z-10">
            -<IndianRupee size={22} />{summary.expense.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-orange-600" size={20} />
            <h3 className="font-bold text-orange-900">AI Paisa Coach</h3>
          </div>
          <button 
            onClick={handleGenerateInsights}
            disabled={loadingInsights}
            className="flex items-center gap-2 text-xs font-medium bg-white text-orange-600 px-4 py-2 rounded-full border border-orange-200 hover:bg-orange-50 transition-colors disabled:opacity-50 shadow-sm"
          >
            {loadingInsights ? <RefreshCw className="animate-spin" size={14} /> : <RefreshCw size={14} />}
            {insights ? 'Refresh Insights' : 'Analyze Spending'}
          </button>
        </div>
        
        {loadingInsights ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-orange-200/50 rounded w-3/4"></div>
            <div className="h-4 bg-orange-200/50 rounded w-1/2"></div>
            <div className="h-4 bg-orange-200/50 rounded w-5/6"></div>
          </div>
        ) : insights ? (
          <div className="prose prose-sm text-orange-900/80 max-w-none">
             <ul className="list-disc pl-4 space-y-2">
               {insights.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*')).map((line, i) => (
                 <li key={i} className="pl-1">{line.replace(/^[-*]\s/, '')}</li>
               ))}
               {!insights.includes('-') && !insights.includes('*') && <p>{insights}</p>}
             </ul>
          </div>
        ) : (
          <p className="text-sm text-orange-800/70">
            Click "Analyze Spending" to get personalized advice powered by Gemini AI based on your recent transaction history.
          </p>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 h-[350px]">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
            Monthly Activity
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 500}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 500}} tickFormatter={(value) => `₹${value}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'Poppins' }}
                cursor={{ fill: '#f8fafc' }}
                formatter={(value) => [`₹${value}`, '']}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Expense" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Categories Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 h-[350px]">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-purple-600 rounded-full"></span>
            Expenses by Category
          </h3>
          <div className="flex items-center h-full pb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'Poppins' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="w-2/5 text-xs space-y-2.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
              {categoryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 justify-between group">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[entry.name] || '#94a3b8' }}></div>
                    <span className="text-slate-600 font-medium truncate group-hover:text-slate-900 transition-colors">{entry.name}</span>
                  </div>
                  <span className="text-slate-400 font-medium group-hover:text-slate-600">
                    {Math.round((entry.value / summary.expense) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};