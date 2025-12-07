import React from 'react';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { Trash2, ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-100 border-dashed">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <IndianRupee size={24} className="text-slate-300" />
        </div>
        <p className="font-medium">No transactions yet</p>
        <p className="text-sm mt-1">Add your first expense or income to get started!</p>
      </div>
    );
  }

  // Sort by date descending
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4">Transaction</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-orange-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {t.type === TransactionType.INCOME ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    </div>
                    <span className="font-semibold text-slate-700">{t.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span 
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold"
                    style={{ 
                      backgroundColor: `${CATEGORY_COLORS[t.category] || '#94a3b8'}15`, 
                      color: CATEGORY_COLORS[t.category] || '#64748b',
                      border: `1px solid ${CATEGORY_COLORS[t.category] || '#94a3b8'}30`
                    }}
                  >
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                  {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className={`px-6 py-4 text-right font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                    title="Delete Transaction"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};