import React, { useEffect, useState } from 'react';
import { Search, MapPin, Star, DollarSign, Clock, Filter } from 'lucide-react';
import { searchAttractions } from '../api/attractionApi';
import { useAuth } from '../hooks/useAuth';

export default function ActivitySearch() {
  const { token } = useAuth();
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await searchAttractions(token, query);
      setRows(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Activity Search</h1>
        <p className="text-gray-500 mt-2">Find things to do, tours, and experiences.</p>
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
              placeholder="Search activities (e.g., Museum, Hiking, Food Tour)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
            />
          </div>
          <button
            onClick={() => load()}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {/* Filters Placeholder */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <Filter size={16} />
          <span>Filters:</span>
          <button className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Type</button>
          <button className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Cost</button>
          <button className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Duration</button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rows.map((a) => (
          <div key={a.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 bg-gray-200 relative">
              <img
                src={a.image_url || 'https://images.unsplash.com/photo-1523592121529-f6dde35f079e?auto=format&fit=crop&w=800&q=80'}
                alt={a.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-900 flex items-center">
                <Star size={12} className="mr-1 text-yellow-500 fill-current" />
                {a.rating || 'N/A'}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{a.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {a.type || 'Activity'}
                </span>
              </div>
              
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{a.description}</p>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-1 text-gray-400" />
                  {a.cost ? `$${a.cost}` : 'Free'}
                </div>
                <div className="flex items-center justify-end">
                  <Clock size={16} className="mr-1 text-gray-400" />
                  {a.duration_minutes ? `${a.duration_minutes}m` : 'Flexible'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No activities found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}
