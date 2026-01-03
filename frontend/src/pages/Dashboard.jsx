import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, MapPin, TrendingUp, DollarSign, Calendar } from 'lucide-react';

import { listTrips, deleteTrip } from '../api/tripApi';
import { topCities } from '../api/cityApi';
import TripCard from '../components/trip/TripCard';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [t, c] = await Promise.all([listTrips(token), topCities(8)]);
      setTrips(t);
      setTop(c);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id) {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await deleteTrip(token, id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  // Calculate budget highlights
  const totalBudget = trips.reduce((acc, t) => acc + (t.budget || 0), 0);
  const activeTripsCount = trips.filter(t => new Date(t.end_date) >= new Date()).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Traveler'}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Ready to plan your next adventure? You have {activeTripsCount} active trips.
            </p>
          </div>
          <button
            onClick={() => navigate('/trips/new')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Plan New Trip
          </button>
        </div>

        {/* Budget Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 p-4 rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{activeTripsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Trips</h2>
          <Link to="/trips" className="text-primary hover:text-primary-dark font-medium">
            View all trips →
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading trips...</div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 3).map((trip) => (
              <TripCard key={trip.id} trip={trip} onDelete={onDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No trips yet. Start planning today!</p>
          </div>
        )}
      </div>

      {/* Recommended Destinations */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {top.map((city) => (
            <div key={city.id} className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 h-48 relative">
                <img
                  src={city.image_url || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80'}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold">{city.name}</h3>
                  <div className="flex items-center text-sm text-gray-200">
                    <MapPin size={14} className="mr-1" />
                    {city.country}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
