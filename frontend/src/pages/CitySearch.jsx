import React, { useEffect, useState } from 'react';
import { Search, MapPin, Globe, TrendingUp } from 'lucide-react';

import { searchCities, topCities } from '../api/cityApi';

export default function CitySearch() {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load(initial = false) {
    setLoading(true);
    setError(null);
    try {
      if (initial && !query) {
        const t = await topCities(20);
        setRows(t);
      } else {
        const res = await searchCities(query);
        setRows(res);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">City Search</h1>
        <p className="text-gray-500 mt-2">Discover your next destination.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
              placeholder="Search destinations (e.g., Paris, Japan, NYC)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load(false)}
            />
          </div>
          <button
            onClick={() => load(false)}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rows.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <img
                src={c.image_url || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80'}
                alt={c.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-900 flex items-center">
                <TrendingUp size={12} className="mr-1 text-green-600" />
                {c.popularity || 'N/A'}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{c.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {c.region || 'World'}
                </span>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <MapPin size={16} className="mr-1" />
                {c.country}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Cost Index: <span className="font-medium text-gray-900">{c.cost_index || 'Medium'}</span>
                </div>
                <button className="text-primary hover:text-primary-dark font-medium text-sm">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No destinations found.</p>
        </div>
      )}
    </div>
  );
}
