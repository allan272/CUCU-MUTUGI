'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Plus,
  Trash2,
  Calendar,
  Filter,
  CreditCard,
  User,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Delete,
  Sparkles,
  Percent,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { Transaction, DEFAULT_TRANSACTIONS } from '@/lib/seeds';

const CATEGORIES = {
  income: [
    'Chicks Sale (Kuroiler)',
    'Chicks Sale (ISA Brown)',
    'Chicks Sale (Broiler Cobb 500)',
    'Chicks Sale (Sasso)',
    'Chicks Sale (Kenbro)',
    'Egg Sales (Kienyeji Trays)',
    'Egg Sales (Commercial)',
    'Mature Chicken / Meat Sales',
    'Poultry Feed Sales',
    'Incubation Services',
    'Delivery & Logistics Fee',
    'Consultation / Farm Training',
    'Other Farm Income'
  ],
  expense: [
    'Feed Purchase (Chick Mash)',
    'Feed Purchase (Growers)',
    'Feed Purchase (Layers Mash)',
    'Feed Purchase (Broiler Finisher)',
    'Vaccines & Veterinary Meds',
    'Transportation & Fuel',
    'Brooding Gas & Heating Charcoal',
    'Farm Labor / Salaries',
    'Egg Trays & Packaging Boxes',
    'Electricity & Water Bills',
    'Farm Equipment & Repairs',
    'Disinfectants & Bio-security',
    'Other Farm Expense'
  ]
};

export default function CommerceTab() {
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formType, setFormType] = useState<'income' | 'expense'>('income');
  const [formCategory, setFormCategory] = useState(CATEGORIES.income[0]);
  const [formAmount, setFormAmount] = useState('');
  const [formPaymentMethod, setFormPaymentMethod] = useState<'M-Pesa' | 'Cash' | 'Bank Transfer' | 'Other'>('M-Pesa');
  const [formCustomer, setFormCustomer] = useState('');
  const [formReference, setFormReference] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Calculator State
  const [calcInput, setCalcInput] = useState('0');
  const [calcPrev, setCalcPrev] = useState<string | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcHistory, setCalcHistory] = useState<string[]>([]);
  const [calcMemory, setCalcMemory] = useState<number | null>(null);

  // Load transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions');
      if (res.ok) {
        const data = await res.json();
        if (data.transactions) {
          setTransactions(data.transactions);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch transactions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Update category when type changes
  useEffect(() => {
    setFormCategory(CATEGORIES[formType][0]);
  }, [formType]);

  // Create Transaction
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    setSubmitting(true);
    const newTx: Omit<Transaction, 'id' | 'createdAt'> = {
      date: formDate,
      type: formType,
      category: formCategory,
      amount: amountNum,
      paymentMethod: formPaymentMethod,
      customerOrVendor: formCustomer.trim() || undefined,
      reference: formReference.trim() || undefined,
      notes: formNotes.trim() || undefined,
    };

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', transaction: newTx }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.transactions) {
          setTransactions(data.transactions);
        }
        setShowAddModal(false);
        setFormAmount('');
        setFormCustomer('');
        setFormReference('');
        setFormNotes('');
      }
    } catch (err) {
      console.error('Failed to add transaction:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Transaction
  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction record?')) return;
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.transactions) setTransactions(data.transactions);
      }
    } catch (e) {
      console.error('Delete transaction failed:', e);
    }
  };

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return transactions.filter(t => {
      // Type filter
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;

      // Date filter
      if (dateFilter === 'today') {
        if (t.date !== todayStr) return false;
      } else if (dateFilter === 'week') {
        const txDate = new Date(t.date);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (txDate < weekAgo) return false;
      } else if (dateFilter === 'month') {
        const txDate = new Date(t.date);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (txDate < monthAgo) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesCat = t.category.toLowerCase().includes(q);
        const matchesCust = (t.customerOrVendor || '').toLowerCase().includes(q);
        const matchesRef = (t.reference || '').toLowerCase().includes(q);
        const matchesNotes = (t.notes || '').toLowerCase().includes(q);
        if (!matchesCat && !matchesCust && !matchesRef && !matchesNotes) return false;
      }

      return true;
    });
  }, [transactions, dateFilter, typeFilter, searchTerm]);

  // Financial KPI Metrics
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    filteredTransactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else if (t.type === 'expense') totalExpense += t.amount;
    });

    const netProfit = totalIncome - totalExpense;
    const margin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

    return { totalIncome, totalExpense, netProfit, margin, count: filteredTransactions.length };
  }, [filteredTransactions]);

  // Today specific sums for calculator shortcuts
  const todaySums = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.date === todayStr) {
        if (t.type === 'income') income += t.amount;
        else expense += t.amount;
      }
    });
    return { income, expense, profit: income - expense };
  }, [transactions]);

  const financeCharts = useMemo(() => {
    const byDate = new Map<string, { income: number; expense: number }>();
    const byCategory = new Map<string, { income: number; expense: number }>();
    const today = new Date();
    const dayMs = 24 * 60 * 60 * 1000;
    const recentDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today.getTime() - (6 - index) * dayMs);
      return date.toISOString().split('T')[0];
    });

    transactions.forEach((tx) => {
      const dateBucket = byDate.get(tx.date) || { income: 0, expense: 0 };
      dateBucket[tx.type] += tx.amount;
      byDate.set(tx.date, dateBucket);

      const categoryBucket = byCategory.get(tx.category) || { income: 0, expense: 0 };
      categoryBucket[tx.type] += tx.amount;
      byCategory.set(tx.category, categoryBucket);
    });

    const dailySeries = recentDays.map((date) => {
      const bucket = byDate.get(date) || { income: 0, expense: 0 };
      return { date, ...bucket, net: bucket.income - bucket.expense };
    });

    const categories = Array.from(byCategory.entries())
      .map(([category, values]) => ({ category, ...values, total: values.income + values.expense }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return { dailySeries, categories };
  }, [transactions]);

  // ─── Calculator Logic ───────────────────────────────────────────────────────
  const handleCalcDigit = (d: string) => {
    setCalcInput(prev => {
      if (prev === '0' || prev === 'Error') return d;
      if (d === '.' && prev.includes('.')) return prev;
      return prev + d;
    });
  };

  const handleCalcOp = (op: string) => {
    if (calcPrev !== null && calcOp !== null) {
      calculateResult();
    }
    setCalcPrev(calcInput);
    setCalcOp(op);
    setCalcInput('0');
  };

  const calculateResult = () => {
    if (!calcPrev || !calcOp) return;
    const a = parseFloat(calcPrev);
    const b = parseFloat(calcInput);
    let res = 0;
    switch (calcOp) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '×': res = a * b; break;
      case '÷': res = b !== 0 ? a / b : 0; break;
      case '%': res = (a * b) / 100; break;
    }
    const resFormatted = parseFloat(res.toFixed(2)).toString();
    const historyEntry = `${calcPrev} ${calcOp} ${calcInput} = ${resFormatted}`;
    setCalcHistory(prev => [historyEntry, ...prev.slice(0, 15)]);
    setCalcInput(resFormatted);
    setCalcPrev(null);
    setCalcOp(null);
  };

  const handleCalcClear = () => {
    setCalcInput('0');
    setCalcPrev(null);
    setCalcOp(null);
  };

  const handleCalcBackspace = () => {
    setCalcInput(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const injectCalcValue = (val: number, label: string) => {
    const formatted = val.toString();
    setCalcInput(formatted);
    setCalcHistory(prev => [`[Inserted ${label}]: KES ${val.toLocaleString()}`, ...prev.slice(0, 15)]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4" /> Commercial Financial Control
          </div>
          <h2 className="text-2xl font-black tracking-tight">Farm Commerce & Daily Transactions Ledger</h2>
          <p className="text-emerald-200 text-xs mt-1">
            Track daily sales, poultry feed & brooding expenses, net profit/loss, and perform instant commercial calculations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTransactions}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Refresh Transactions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider py-3 px-5 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Record New Transaction
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Income ({dateFilter})</div>
            <div className="text-xl font-black text-emerald-700">KES {stats.totalIncome.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-red-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-black">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Expenses ({dateFilter})</div>
            <div className="text-xl font-black text-red-600">KES {stats.totalExpense.toLocaleString()}</div>
          </div>
        </div>

        <div className={`p-5 rounded-3xl border shadow-sm flex items-center gap-4 ${
          stats.netProfit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
            stats.netProfit >= 0 ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Net Profit / Loss</div>
            <div className={`text-xl font-black ${stats.netProfit >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
              KES {stats.netProfit.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Profit Margin</div>
            <div className="text-xl font-black text-amber-800">{stats.margin.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-lg font-black text-slate-900">7-Day Profit Trend</h3>
              <p className="text-xs text-slate-500">Income vs expense by day</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
              Live snapshot
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2 items-end h-52">
            {financeCharts.dailySeries.map((day) => {
              const max = Math.max(...financeCharts.dailySeries.map((item) => Math.max(item.income, item.expense, Math.abs(item.net), 1)));
              const incomeHeight = (day.income / max) * 100;
              const expenseHeight = (day.expense / max) * 100;
              const netHeight = (Math.abs(day.net) / max) * 100;
              return (
                <div key={day.date} className="flex h-full flex-col items-center justify-end gap-2">
                  <div className="flex w-full items-end justify-center gap-1 h-40">
                    <div className="w-2.5 rounded-full bg-emerald-500/80" style={{ height: `${Math.max(incomeHeight, 3)}%` }} />
                    <div className="w-2.5 rounded-full bg-red-500/80" style={{ height: `${Math.max(expenseHeight, 3)}%` }} />
                    <div className={`w-2.5 rounded-full ${day.net >= 0 ? 'bg-amber-400' : 'bg-slate-400'}`} style={{ height: `${Math.max(netHeight, 3)}%` }} />
                  </div>
                  <div className="text-[10px] font-bold text-slate-500">{day.date.slice(5)}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Income</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Expense</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Net</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-lg font-black text-slate-900">Income vs Expense Mix</h3>
              <p className="text-xs text-slate-500">Simple view of where money is going</p>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">
              Pie view
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-[180px_1fr] items-center">
            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-slate-950 shadow-inner">
              <div
                className="h-32 w-32 rounded-full border-[18px] border-emerald-500 border-r-red-500 border-b-amber-400 border-l-slate-200"
                style={{ transform: 'rotate(-18deg)' }}
              />
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Total Income</div>
                <div className="text-2xl font-black text-emerald-900">KES {stats.totalIncome.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-red-50 p-4">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-red-700">Total Expenses</div>
                <div className="text-2xl font-black text-red-900">KES {stats.totalExpense.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Net Profit</div>
                <div className={`text-2xl font-black ${stats.netProfit >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
                  KES {stats.netProfit.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left side Ledger, Right side Interactive Calculator */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 8 Cols: Transactions Ledger Table */}
        <div className="xl:col-span-8 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filters:
                </span>
                <div className="inline-flex rounded-xl bg-slate-100 p-1">
                  {(['today', 'week', 'month', 'all'] as const).map(df => (
                    <button
                      key={df}
                      onClick={() => setDateFilter(df)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                        dateFilter === df ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {df === 'today' ? 'Today' : df === 'week' ? 'This Week' : df === 'month' ? 'This Month' : 'All'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Types (Incomes & Expenses)</option>
                  <option value="income">Incomes Only</option>
                  <option value="expense">Expenses Only</option>
                </select>

                <input
                  type="text"
                  placeholder="Search customer, ref, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 w-44 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Transactions List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Type</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Payment</th>
                    <th className="py-3 px-2">Customer / Vendor</th>
                    <th className="py-3 px-2">Ref / Notes</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-semibold">
                        No transactions recorded for this filter. Click &quot;Record New Transaction&quot; to add one.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-2 font-bold text-slate-700 whitespace-nowrap">{tx.date}</td>
                        <td className="py-3 px-2 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            tx.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.type === 'income' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-bold text-slate-900">{tx.category}</td>
                        <td className={`py-3 px-2 font-black whitespace-nowrap ${
                          tx.type === 'income' ? 'text-emerald-700' : 'text-red-600'
                        }`}>
                          {tx.type === 'income' ? '+' : '-'} KES {tx.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-slate-600 font-medium whitespace-nowrap">{tx.paymentMethod}</td>
                        <td className="py-3 px-2 text-slate-800 font-bold whitespace-nowrap">{tx.customerOrVendor || '—'}</td>
                        <td className="py-3 px-2 text-slate-500 max-w-[140px] truncate" title={tx.notes || tx.reference}>
                          {tx.reference && <span className="font-semibold text-emerald-800 mr-1">[{tx.reference}]</span>}
                          {tx.notes || '—'}
                        </td>
                        <td className="py-3 px-2 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteTransaction(tx.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Interactive Financial Calculator */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-slate-950 p-6 rounded-3xl text-white shadow-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-black text-amber-400 text-sm uppercase tracking-wider">
                <Calculator className="w-5 h-5" /> Commercial Calculator
              </div>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                Live Engine
              </span>
            </div>

            {/* Quick 1-Click Financial Auto-Fill Shortcuts */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Instant Commerce Data Shortcuts:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => injectCalcValue(todaySums.income, "Today's Total Income")}
                  className="text-[10px] p-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 rounded-xl font-bold transition-all text-left flex items-center justify-between cursor-pointer"
                >
                  <span>📥 Today Income:</span>
                  <span className="font-black text-white">{todaySums.income.toLocaleString()}</span>
                </button>

                <button
                  type="button"
                  onClick={() => injectCalcValue(todaySums.expense, "Today's Total Expenses")}
                  className="text-[10px] p-2 bg-red-950/80 hover:bg-red-900 border border-red-600/40 text-red-300 rounded-xl font-bold transition-all text-left flex items-center justify-between cursor-pointer"
                >
                  <span>📤 Today Expense:</span>
                  <span className="font-black text-white">{todaySums.expense.toLocaleString()}</span>
                </button>

                <button
                  type="button"
                  onClick={() => injectCalcValue(todaySums.profit, "Today's Net Profit")}
                  className="text-[10px] p-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-600/40 text-amber-300 rounded-xl font-bold transition-all text-left flex items-center justify-between cursor-pointer"
                >
                  <span>💰 Net Profit:</span>
                  <span className="font-black text-white">{todaySums.profit.toLocaleString()}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const pricePerChick = 120;
                    const feedPerChick = 45;
                    const netMarginPerChick = pricePerChick - feedPerChick;
                    injectCalcValue(netMarginPerChick, "Per Chick Profit (KES 120 - 45)");
                  }}
                  className="text-[10px] p-2 bg-teal-950/80 hover:bg-teal-900 border border-teal-600/40 text-teal-300 rounded-xl font-bold transition-all text-left flex items-center justify-between cursor-pointer"
                >
                  <span>🐣 Chick Margin:</span>
                  <span className="font-black text-white">KES 75/bird</span>
                </button>
              </div>
            </div>

            {/* Calculator Display */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-right space-y-1">
              <div className="text-slate-400 text-xs font-mono h-5">
                {calcPrev ? `${calcPrev} ${calcOp}` : ' '}
              </div>
              <div className="text-3xl font-mono font-black text-amber-400 tracking-wider truncate">
                {calcInput}
              </div>
            </div>

            {/* Calculator Keypad */}
            <div className="grid grid-cols-4 gap-2 text-sm font-black">
              <button
                type="button"
                onClick={handleCalcClear}
                className="p-3.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded-xl transition-all cursor-pointer"
              >
                C
              </button>
              <button
                type="button"
                onClick={handleCalcBackspace}
                className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all flex items-center justify-center cursor-pointer"
              >
                <Delete className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleCalcOp('%')}
                className="p-3.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl transition-all cursor-pointer"
              >
                %
              </button>
              <button
                type="button"
                onClick={() => handleCalcOp('÷')}
                className="p-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition-all cursor-pointer"
              >
                ÷
              </button>

              <button type="button" onClick={() => handleCalcDigit('7')} className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer">7</button>
              <button type="button" onClick={() => handleCalcDigit('8')} className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer">8</button>
              <button type="button" onClick={() => handleCalcDigit('9')} className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer">9</button>
              <button type="button" onClick={() => handleCalcOp('×')} className="p-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition-all cursor-pointer">×</button>

              <button type="button" onClick={() => handleCalcDigit('4')} className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer">4</button>
              <button type="button" onClick={() => handleCalcDigit('5')} className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer">5</button>
              <button type="button" onClick={() => handleCalcDigit('6')} className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer">6</button>
              <button type="button" onClick={() => handleCalcOp('-')} className="p-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition-all cursor-pointer">-</button>

              <button type="button" onClick={() => handleCalcDigit('1')} className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer">1</button>
              <button type="button" onClick={() => handleCalcDigit('2')} className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer">2</button>
              <button type="button" onClick={() => handleCalcDigit('3')} className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer">3</button>
              <button type="button" onClick={() => handleCalcOp('+')} className="p-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition-all cursor-pointer">+</button>

              <button type="button" onClick={() => handleCalcDigit('0')} className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl col-span-2 transition-all cursor-pointer">0</button>
              <button type="button" onClick={() => handleCalcDigit('.')} className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer">.</button>
              <button
                type="button"
                onClick={calculateResult}
                className="p-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-900/40"
              >
                =
              </button>
            </div>

            {/* Tape History */}
            {calcHistory.length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase">
                  <span>Calculation Tape:</span>
                  <button onClick={() => setCalcHistory([])} className="text-red-400 hover:underline cursor-pointer">Clear</button>
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1 pr-1 text-[11px] font-mono text-slate-300">
                  {calcHistory.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-800/80 truncate">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" /> Record Daily Transaction
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 font-black text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Type *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full text-xs font-bold p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="income">🟢 Income (Money In)</option>
                    <option value="expense">🔴 Expense (Money Out)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES[formType].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount (KES) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    placeholder="e.g. 15000"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full text-xs font-black p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 text-emerald-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value as any)}
                    className="w-full text-xs font-semibold p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer / Vendor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Farmer Mwangi"
                    value={formCustomer}
                    onChange={(e) => setFormCustomer(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">M-Pesa Code / Receipt Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. QKH8716281"
                    value={formReference}
                    onChange={(e) => setFormReference(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 150 ISA Brown Layer day-old chicks delivered to Nyeri"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  {submitting ? 'Recording...' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
