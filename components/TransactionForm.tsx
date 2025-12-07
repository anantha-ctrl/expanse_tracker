import React, { useState } from 'react';
import { Wand2, Plus, Loader2, IndianRupee } from 'lucide-react';
import { Transaction, TransactionType, Category } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';
import { predictCategory } from '../services/geminiService';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<string>(Category.OTHER);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPredicting, setIsPredicting] = useState(false);

  const handlePredictCategory = async () => {
    if (!description.trim()) return;
    
    setIsPredicting(true);
    try {
      const predicted = await predictCategory(description);
      setCategory(predicted);
      
      // Auto-switch type based on category
      if (predicted === Category.INCOME) {
        setType(TransactionType.INCOME);
      } else {
        setType(TransactionType.EXPENSE);
      }
    } finally {
      setIsPredicting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      amount: parseFloat(amount),
      description,
      type,
      category: type === TransactionType.INCOME ? Category.INCOME : category,
      date,
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory(Category.OTHER);
    setType(TransactionType.EXPENSE);
    setDate(new Date().toISOString().split('T')[0]);
  };

  // Trigger prediction on blur if description is long enough and category is still "Other"
  const handleBlur = () => {
    if (description.length > 2 && category === Category.OTHER) {
      handlePredictCategory();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg shadow-orange-100 border border-orange-50">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
        Add Transaction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Type Selection */}
        <div className="flex gap-2 p-1 bg-orange-50/50 rounded-lg w-full sm:w-fit border border-orange-100">
          <button
            type="button"
            onClick={() => setType(TransactionType.EXPENSE)}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              type === TransactionType.EXPENSE
                ? 'bg-white text-orange-600 shadow-sm border border-orange-100'
                : 'text-slate-500 hover:text-orange-600'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => {
              setType(TransactionType.INCOME);
              setCategory(Category.INCOME);
            }}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              type === TransactionType.INCOME
                ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100'
                : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            Income
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <IndianRupee size={16} />
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Description & AI */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
          <div className="relative flex gap-2">
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleBlur}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
              placeholder="e.g., Grocery at BigBasket, Chai"
            />
            <button
              type="button"
              onClick={handlePredictCategory}
              disabled={isPredicting || !description}
              className="px-3 py-2 text-orange-600 bg-orange-50 border border-orange-100 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Auto-categorize with AI"
            >
              {isPredicting ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
            </button>
          </div>
        </div>

        {/* Category */}
        {type === TransactionType.EXPENSE && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white font-medium"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all shadow-md shadow-orange-500/20 font-semibold mt-2"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </form>
    </div>
  );
};