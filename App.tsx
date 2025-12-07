import React, { useState, useEffect } from 'react';
import { Transaction } from './types';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { LayoutDashboard, List, PlusCircle, IndianRupee, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-orange-50/30 text-slate-900 pb-20 md:pb-0 font-[Poppins] flex flex-col">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-gradient-to-r from-orange-600 to-amber-600 border-b border-orange-700/20 px-4 md:px-8 py-4 flex items-center justify-between shadow-lg shadow-orange-600/10">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg border border-white/20">
            <IndianRupee className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            FinanceFlow AI
          </h1>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-1 bg-white/10 backdrop-blur-md p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-white text-orange-700 shadow-sm' 
                : 'text-orange-50 hover:bg-white/10 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'transactions' 
                ? 'bg-white text-orange-700 shadow-sm' 
                : 'text-orange-50 hover:bg-white/10 hover:text-white'
            }`}
          >
            Transactions
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form & Recent List on large screens */}
          <div className="lg:col-span-1 space-y-8 order-2 lg:order-1">
            <TransactionForm onAdd={addTransaction} />
            
            <div className="hidden lg:block bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 border border-slate-800 text-white shadow-xl">
              <h3 className="font-bold text-amber-400 mb-2 text-lg">Pro Tip</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Describe your expense naturally like "Swiggy order ₹450" or "Uber to airport" and use the <span className="text-white font-semibold">Magic Wand</span>. Our AI understands Indian context like UPI, Kirana, and more!
              </p>
            </div>
          </div>

          {/* Right Column: Dashboard or Full List */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {activeTab === 'dashboard' ? (
              <Dashboard transactions={transactions} />
            ) : (
              <TransactionList transactions={transactions} onDelete={deleteTransaction} />
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 py-8 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Logo & Copyright */}
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-1.5 rounded-lg">
                <IndianRupee className="text-orange-600" size={16} />
              </div>
              <span className="text-sm font-semibold text-slate-600">
                FinanceFlow AI <span className="text-slate-400 font-normal ml-1">© {new Date().getFullYear()}</span>
              </span>
            </div>

            {/* Made in India */}
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
              <span>Designed and Developed </span>
              <span>by <a href="https://github.com/anantha-ctrl/" className="hover:text-orange-600 transition-colors">Anantha Kumar G</a></span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around items-center z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'text-orange-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold mt-1">Dashboard</span>
        </button>
        <div className="relative -top-5">
           <button 
             onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
             }}
             className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-3 rounded-full shadow-lg shadow-orange-600/40 active:scale-95 transition-transform border-4 border-white"
           >
             <PlusCircle size={28} />
           </button>
        </div>
        <button 
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'transactions' ? 'text-orange-600' : 'text-slate-400'}`}
        >
          <List size={20} />
          <span className="text-[10px] font-bold mt-1">History</span>
        </button>
      </div>

    </div>
  );
};

export default App;