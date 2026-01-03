import React, { useMemo, useState } from 'react';
import { Clock, DollarSign, Plus, Trash2, Tag, FileText } from 'lucide-react';

export default function TimelineDay({ date, activities, expenses, onCreateExpense, onDeleteExpense }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const totalExpenses = useMemo(() => {
    return (expenses || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [expenses]);

  async function addExpense(e) {
    e.preventDefault();
    const cat = category.trim();
    const amt = Number(amount);
    if (!cat || Number.isNaN(amt)) return;
    await onCreateExpense?.({ expense_date: date, category: cat, amount: amt, notes: notes || null });
    setCategory('');
    setAmount('');
    setNotes('');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Activities Column */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Activities</h3>
          <span className="text-sm text-gray-500">{activities.length} items</span>
        </div>

        {activities.length === 0 ? (
          <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
            <p className="text-gray-500">No activities scheduled for this day.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((a) => (
              <div key={a.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock size={20} />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-900">{a.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                    {a.start_time && (
                      <span className="flex items-center">
                        {new Date(a.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    )}
                    {a.type && (
                      <span className="flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">
                        {a.type}
                      </span>
                    )}
                  </div>
                  {a.notes && <p className="mt-2 text-sm text-gray-600">{a.notes}</p>}
                </div>
                {a.cost > 0 && (
                  <div className="text-right font-medium text-gray-900">
                    ${Number(a.cost).toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expenses Column */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Daily Expenses</h3>
          <span className="font-bold text-gray-900">${totalExpenses.toFixed(2)}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Add Expense</h4>
            <form onSubmit={addExpense} className="space-y-2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={14} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Category (e.g. Lunch)"
                  className="focus:ring-primary focus:border-primary block w-full pl-9 sm:text-sm border-gray-300 rounded-md"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  placeholder="Amount"
                  className="focus:ring-primary focus:border-primary block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText size={14} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Notes (optional)"
                  className="focus:ring-primary focus:border-primary block w-full pl-9 sm:text-sm border-gray-300 rounded-md"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Plus size={16} className="mr-2" /> Add Expense
              </button>
            </form>
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {expenses.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-2">No extra expenses recorded.</p>
            ) : (
              expenses.map((e) => (
                <div key={e.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg group">
                  <div>
                    <div className="font-medium text-gray-900">{e.category}</div>
                    {e.notes && <div className="text-xs text-gray-500">{e.notes}</div>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">${Number(e.amount || 0).toFixed(2)}</span>
                    <button
                      onClick={() => onDeleteExpense?.(e.id)}
                      className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
