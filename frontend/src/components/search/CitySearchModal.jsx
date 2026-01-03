import React from 'react';
import { X } from 'lucide-react';
import { searchCities } from '../../api/cityApi';
import AsyncSelect from '../AsyncSelect';

export default function CitySearchModal({ open, onClose, onSelectCity }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ minHeight: 300 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <strong>Select a City</strong>
          <button className="button secondary" onClick={onClose} style={{ padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <AsyncSelect
          loadOptions={async (inputValue) => {
            const results = await searchCities(inputValue);
            return results;
          }}
          value={null}
          onChange={(city) => {
            if (city) {
              onSelectCity(city);
            }
          }}
          placeholder="Search city or country..."
          labelKey="name"
          renderOption={(option) => (
            <div>
              <div style={{ fontWeight: 500 }}>{option.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>{option.country}</div>
            </div>
          )}
        />
        
        <div className="small" style={{ marginTop: 16, color: '#666' }}>
          Start typing to search for a city to add to your trip.
        </div>
      </div>
    </div>
  );
}
