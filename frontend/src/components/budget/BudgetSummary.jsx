import React, { useState } from 'react';
import { DollarSign, PieChart, AlertCircle, Plus, Trash2 } from 'lucide-react';

export default function BudgetSummary({ trip, stops, activitiesByStop, expenses, onCreateExpense, onDeleteExpense }) {
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'other' });

  const transportCost = stops.reduce((sum, s) => sum + Number(s.transport_cost || 0), 0);
  const stayCost = stops.reduce((sum, s) => sum + Number(s.stay_cost || 0), 0);
  const mealsCost = stops.reduce((sum, s) => sum + Number(s.meals_cost || 0), 0);
  const activitiesCost = Object.values(activitiesByStop).flat().reduce((sum, a) => sum + Number(a.cost || 0), 0);
  const miscExpensesCost = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalCost = transportCost + stayCost + mealsCost + activitiesCost + miscExpensesCost;
  const budgetLimit = Number(trip.budget || 0);
  const remaining = budgetLimit > 0 ? budgetLimit - totalCost : null;
  const isOverBudget = budgetLimit > 0 && totalCost > budgetLimit;

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;
    onCreateExpense({
      description: newExpense.description,
      amount: Number(newExpense.amount),
      category: newExpense.category,
      date: new Date().toISOString().split('T')[0]
    });
    setNewExpense({ description: '', amount: '', category: 'other' });
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Cost</h3>
            <DollarSign size={20} className="text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${totalCost.toFixed(2)}</div>
          <div className="mt-1 text-sm text-gray-500">Estimated total</div>
        </div>

        {budgetLimit > 0 && (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Budget Limit</h3>
                <PieChart size={20} className="text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">${budgetLimit.toFixed(2)}</div>
              <div className="mt-1 text-sm text-gray-500">Target budget</div>
            </div>

            <div className={`p-6 rounded-xl shadow-sm border ${remaining < 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-medium uppercase tracking-wider ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {remaining < 0 ? 'Over Budget' : 'Remaining'}
                </h3>
                {remaining < 0 ? <AlertCircle size={20} className="text-red-500" /> : <DollarSign size={20} className="text-green-500" />}
              </div>
              <div className={`text-3xl font-bold ${remaining < 0 ? 'text-red-700' : 'text-green-700'}`}>
                ${Math.abs(remaining).toFixed(2)}
              </div>
              <div className={`mt-1 text-sm ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {remaining < 0 ? 'exceeded' : 'available'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Cost Breakdown</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                <span className="text-gray-600">Accommodation</span>
              </div>
              <span className="font-medium text-gray-900">${stayCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <span className="text-gray-600">Transport</span>
              </div>
              <span className="font-medium text-gray-900">${transportCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                <span className="text-gray-600">Meals</span>
              </div>
              <span className="font-medium text-gray-900">${mealsCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                <span className="text-gray-600">Activities</span>
              </div>
              <span className="font-medium text-gray-900">${activitiesCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-3"></div>
                <span className="text-gray-600">Miscellaneous</span>
              </div>
              <span className="font-medium text-gray-900">${miscExpensesCost.toFixed(2)}</span>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">${totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Miscellaneous Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Miscellaneous Expenses</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleAddExpense} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Description"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Plus size={16} />
              </button>
            </form>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {expenses.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No miscellaneous expenses added.</p>
              ) : (
                expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{expense.description}</div>
                      <div className="text-xs text-gray-500">{expense.date}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">${Number(expense.amount).toFixed(2)}</span>
                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="text-gray-400 hover:text-red-600"
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
    </div>
  );
}
