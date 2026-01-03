import React from 'react';
import { Map, DollarSign, Calendar, Share2 } from 'lucide-react';

const tabs = [
  { key: 'itinerary', label: 'Itinerary', icon: Map },
  { key: 'budget', label: 'Budget', icon: DollarSign },
  { key: 'timeline', label: 'Timeline', icon: Calendar },
  { key: 'share', label: 'Share', icon: Share2 },
];

export default function TripTabs({ active, onChange }) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`
                ${isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
              `}
            >
              <Icon
                className={`
                  ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}
                  -ml-0.5 mr-2 h-5 w-5
                `}
              />
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
