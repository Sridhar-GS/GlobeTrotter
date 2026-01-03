import React from 'react';
import { X } from 'lucide-react';
import { createApiClient } from '../../api/apiClient';
import AsyncSelect from '../AsyncSelect';

export default function ActivitySearch({ open, onClose, onPick }) {
  if (!open) return null;

  async function searchAttractions(query) {
    const client = createApiClient();
    const res = await client.get('/attractions', { params: { query } });
    return res.data;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ minHeight: 300 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <strong>Activity Search</strong>
          <button className="button secondary" onClick={onClose} style={{ padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <AsyncSelect
          loadOptions={searchAttractions}
          value={null}
          onChange={(item) => {
            if (item) {
              onPick({
                name: item.name,
                type: item.type,
                cost: item.cost,
                notes: item.description
              });
              onClose();
            }
          }}
          placeholder="Search attractions..."
          labelKey="name"
          renderOption={(option) => (
            <div>
              <div style={{ fontWeight: 500 }}>{option.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                {option.type} • ${option.cost}
              </div>
            </div>
          )}
        />
        
        <div className="small" style={{ marginTop: 16, color: '#666' }}>
          Search for attractions to add as an activity.
        </div>
      </div>
    </div>
  );
}
