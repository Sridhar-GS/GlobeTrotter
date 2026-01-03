import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Trash2, Eye } from 'lucide-react';

export default function TripCard({ trip, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{trip.name}</h3>
          {trip.budget && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ${trip.budget}
            </span>
          )}
        </div>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-2 text-gray-400" />
            <span>
              {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'TBD'} 
              {' → '} 
              {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : 'TBD'}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={16} className="mr-2 text-gray-400" />
            <span>{trip.destination_count || 0} stops</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
        <Link 
          to={`/trips/${trip.id}`} 
          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Eye size={16} className="mr-2" />
          View
        </Link>
        <button 
          onClick={() => onDelete?.(trip.id)} 
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
