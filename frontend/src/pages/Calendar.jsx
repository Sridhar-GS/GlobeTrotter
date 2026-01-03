import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { listTrips } from '../api/tripApi';
import { useAuth } from '../hooks/useAuth';

function iso(date) {
  return date.toISOString().slice(0, 10);
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d, delta) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

function monthLabel(d) {
  return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
}

export default function Calendar() {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [month, setMonth] = useState(() => startOfMonth(new Date()));

  useEffect(() => {
    let mounted = true;
    async function load() {
      setError(null);
      setLoading(true);
      try {
        const res = await listTrips(token);
        if (mounted) setTrips(res);
      } catch (e) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  const days = useMemo(() => {
    const first = startOfMonth(month);
    const startDay = new Date(first);
    // Sunday start
    const dayOfWeek = startDay.getDay();
    startDay.setDate(startDay.getDate() - dayOfWeek);

    const grid = [];
    for (let i = 0; i < 42; i += 1) {
      const d = new Date(startDay);
      d.setDate(startDay.getDate() + i);
      grid.push(d);
    }
    return grid;
  }, [month]);

  function tripsForDate(d) {
    const key = iso(d);
    return trips.filter((t) => {
      if (!t.start_date || !t.end_date) return false;
      return t.start_date <= key && key <= t.end_date;
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <CalendarIcon className="mr-3 text-primary" size={32} />
          Trip Calendar
        </h1>
        <div className="flex items-center space-x-4 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button
            onClick={() => setMonth((m) => addMonths(m, -1))}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-lg font-medium text-gray-900 min-w-[160px] text-center">
            {monthLabel(month)}
          </span>
          <button
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px border-b border-gray-200">
          {days.map((d, idx) => {
            const inMonth = d.getMonth() === month.getMonth();
            const isToday = iso(d) === iso(new Date());
            const dayTrips = tripsForDate(d);
            
            return (
              <div 
                key={d.toISOString()} 
                className={`min-h-[120px] bg-white p-2 ${!inMonth ? 'bg-gray-50 text-gray-400' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span 
                    className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-primary text-white' : inMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {d.getDate()}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1">
                  {dayTrips.map((t) => {
                    const isStart = t.start_date === iso(d);
                    const isEnd = t.end_date === iso(d);
                    // Simple color hashing based on trip ID
                    const colors = [
                      'bg-blue-100 text-blue-800 border-blue-200',
                      'bg-green-100 text-green-800 border-green-200',
                      'bg-purple-100 text-purple-800 border-purple-200',
                      'bg-yellow-100 text-yellow-800 border-yellow-200',
                      'bg-pink-100 text-pink-800 border-pink-200',
                    ];
                    const colorClass = colors[t.id % colors.length];

                    return (
                      <Link
                        key={t.id}
                        to={`/trips/${t.id}`}
                        className={`block text-xs px-2 py-1 rounded border truncate transition-transform hover:scale-105 ${colorClass}`}
                        title={`${t.name} (${t.start_date} - ${t.end_date})`}
                      >
                        {t.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
