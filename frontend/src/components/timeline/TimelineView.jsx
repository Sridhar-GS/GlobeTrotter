import React, { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

import TimelineDay from './TimelineDay';

function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

function parseISODate(value) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toDateKey(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

export default function TimelineView({ trip, stops, activitiesByStop, expenses, onCreateExpense, onDeleteExpense }) {
  const days = useMemo(() => {
    const start = parseISODate(trip?.start_date);
    const end = parseISODate(trip?.end_date);
    if (!start || !end) return [];

    const out = [];
    const cur = new Date(start);
    while (cur.getTime() <= end.getTime()) {
      out.push(toISODate(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return out;
  }, [trip?.start_date, trip?.end_date]);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedDate = days[selectedIdx] || days[0] || 'Unscheduled';

  const { activitiesForDay, expensesForDay, stopForDay } = useMemo(() => {
    const dayKey = selectedDate;

    const act = [];
    Object.values(activitiesByStop || {}).forEach((arr) => {
      (arr || []).forEach((a) => {
        const k = toDateKey(a.start_time);
        if (k === dayKey) act.push(a);
      });
    });

    act.sort((a, b) => {
      const ta = a.start_time ? new Date(a.start_time).getTime() : 0;
      const tb = b.start_time ? new Date(b.start_time).getTime() : 0;
      return ta - tb;
    });

    const exp = (expenses || []).filter((e) => (e.date || e.expense_date || '').startsWith(dayKey));
    
    // Find which stop covers this day
    const currentStop = stops.find(s => {
      if (!s.start_date || !s.end_date) return false;
      return dayKey >= s.start_date && dayKey <= s.end_date;
    });

    return { activitiesForDay: act, expensesForDay: exp, stopForDay: currentStop };
  }, [activitiesByStop, expenses, stops, selectedDate]);

  const handlePrevDay = () => {
    if (selectedIdx > 0) setSelectedIdx(selectedIdx - 1);
  };

  const handleNextDay = () => {
    if (selectedIdx < days.length - 1) setSelectedIdx(selectedIdx + 1);
  };

  if (days.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500">No dates defined for this trip.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Day Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={handlePrevDay}
            disabled={selectedIdx === 0}
            className={`p-2 rounded-full hover:bg-gray-100 ${selectedIdx === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'}`}
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Day {selectedIdx + 1}</h2>
            <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
              <Calendar size={14} className="mr-1" />
              {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {stopForDay && (
              <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {stopForDay.city_name}
              </div>
            )}
          </div>

          <button 
            onClick={handleNextDay}
            disabled={selectedIdx === days.length - 1}
            className={`p-2 rounded-full hover:bg-gray-100 ${selectedIdx === days.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Horizontal Scrollable Day List */}
        <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
          {days.map((d, idx) => {
            const dateObj = new Date(d);
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={d}
                onClick={() => setSelectedIdx(idx)}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-lg border transition-colors ${
                  isSelected 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                <span className="text-xs font-medium uppercase">{dateObj.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                <span className="text-lg font-bold">{dateObj.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Content */}
      <TimelineDay
        date={selectedDate}
        activities={activitiesForDay}
        expenses={expensesForDay}
        onCreateExpense={onCreateExpense}
        onDeleteExpense={onDeleteExpense}
      />
    </div>
  );
}
