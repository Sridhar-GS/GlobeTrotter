import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Copy, ArrowRight, Globe } from 'lucide-react';

import { copyPublicTrip, getPublicTrip } from '../api/tripApi';
import { useAuth } from '../hooks/useAuth';

export default function PublicTrip() {
  const { shareId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getPublicTrip(shareId);
        if (mounted) setData(res);
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
  }, [shareId]);

  async function onCopy() {
    if (!token) {
      // Redirect to login with return url
      navigate('/login', { state: { from: `/public/${shareId}` } });
      return;
    }
    try {
      const res = await copyPublicTrip(token, shareId);
      navigate(`/trips/${res.new_trip_id}`);
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-500">Loading public itinerary...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 max-w-md w-full text-center">
        <div className="text-red-500 mb-4">
          <Globe size={48} className="mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Trip Not Found</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link to="/" className="text-primary hover:underline">Go to Home</Link>
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-primary/5 p-8 text-center border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.trip.name}</h1>
            <div className="flex items-center justify-center text-gray-500 space-x-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {data.trip.start_date} → {data.trip.end_date}
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {data.stops.length} Stops
              </div>
            </div>
          </div>
          <div className="p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              This is a public itinerary shared by a GlobeTrotter user.
            </div>
            <button
              onClick={onCopy}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full sm:w-auto justify-center"
            >
              <Copy size={18} className="mr-2" />
              Copy to My Trips
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
          {data.stops.map((stop, idx) => (
            <div key={stop.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-100 group-[.is-active]:bg-primary group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="font-bold text-sm">{idx + 1}</span>
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {stop.city_name || `City #${stop.city_id}`}
                  </h3>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {stop.city_country}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-4 flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {stop.start_date} - {stop.end_date}
                </div>
                
                {/* If we had activities, we could list them here */}
                {/* <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                   <div className="text-xs font-medium text-gray-400 uppercase">Highlights</div>
                   ...
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {!token && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Want to create your own trips?</p>
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Sign Up for Free <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
