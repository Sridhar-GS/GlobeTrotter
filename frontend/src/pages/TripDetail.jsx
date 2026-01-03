import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, MapPin, Share2, Copy, Check, MoreVertical, Trash2, Edit2, ArrowUp, ArrowDown } from 'lucide-react';

import {
  createActivity,
  createStop,
  deleteActivity,
  deleteStop,
  getTrip,
  listActivities,
  listStops,
  shareTrip,
  updateActivity,
  updateStop,
} from '../api/tripApi';
import { createExpense, deleteExpense, listExpenses } from '../api/expenseApi';
import { useAuth } from '../hooks/useAuth';

import TripTabs from '../components/trip/TripTabs';
import CitySearchModal from '../components/search/CitySearchModal';
import ActivitySearch from '../components/search/ActivitySearch';
import StopForm from '../components/trip/StopForm';
import ActivityForm from '../components/trip/ActivityForm';
import BudgetSummary from '../components/budget/BudgetSummary';
import TimelineView from '../components/timeline/TimelineView';

export default function TripDetail() {
  const { token } = useAuth();
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState('itinerary');
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activitiesByStop, setActivitiesByStop] = useState({});
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [stopFormMode, setStopFormMode] = useState(null); // { mode: 'create'|'edit', stop }

  const [activityModal, setActivityModal] = useState({ open: false, stopId: null });
  const [activityFormMode, setActivityFormMode] = useState(null); // { mode: 'create'|'edit', stopId, activity }
  const [activitySearchOpen, setActivitySearchOpen] = useState(false);
  const [shareInfo, setShareInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const t = await getTrip(token, tripId);
      const s = await listStops(token, tripId);
      const e = await listExpenses(token, tripId);
      setTrip(t);
      setStops(s);
      setExpenses(e);

      const acts = {};
      await Promise.all(
        s.map(async (stop) => {
          const a = await listActivities(token, stop.id);
          acts[stop.id] = a;
        })
      );
      setActivitiesByStop(acts);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, [tripId]);

  const sortedStops = useMemo(() => {
    return [...stops].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  }, [stops]);

  function sectionBudget(stop) {
    const stay = Number(stop?.stay_cost || 0);
    const transport = Number(stop?.transport_cost || 0);
    const meals = Number(stop?.meals_cost || 0);
    const act = (activitiesByStop[stop?.id] || []).reduce((sum, a) => sum + Number(a.cost || 0), 0);
    return stay + transport + meals + act;
  }

  function openCreateStopFlow() {
    setSelectedCity(null);
    setStopFormMode(null);
    setCityModalOpen(true);
  }

  async function onCitySelected(city) {
    setSelectedCity(city);
    setCityModalOpen(false);
    setStopFormMode({ mode: 'create', stop: null });
  }

  async function handleSaveStop(payload) {
    try {
      if (stopFormMode.mode === 'create') {
        const finalPayload = { ...payload, city_id: selectedCity?.id };
        await createStop(token, tripId, finalPayload);
      } else {
        await updateStop(token, stopFormMode.stop.id, payload);
      }
      setStopFormMode(null);
      loadAll();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDeleteStop(id) {
    if (!window.confirm('Delete this stop?')) return;
    try {
      await deleteStop(token, id);
      loadAll();
    } catch (e) {
      alert(e.message);
    }
  }

  async function moveStop(stopId, direction) {
    const idx = sortedStops.findIndex((s) => s.id === stopId);
    if (idx < 0) return;
    const otherIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (otherIdx < 0 || otherIdx >= sortedStops.length) return;

    const a = sortedStops[idx];
    const b = sortedStops[otherIdx];

    try {
      await Promise.all([
        updateStop(token, a.id, { order_index: b.order_index }),
        updateStop(token, b.id, { order_index: a.order_index }),
      ]);
      loadAll();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleSaveActivity(payload) {
    try {
      if (activityFormMode.mode === 'create') {
        await createActivity(token, activityFormMode.stopId, payload);
      } else {
        await updateActivity(token, activityFormMode.activity.id, payload);
      }
      setActivityFormMode(null);
      setActivityModal({ open: false, stopId: null });
      loadAll();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDeleteActivity(id) {
    if (!window.confirm('Delete activity?')) return;
    try {
      await deleteActivity(token, id);
      loadAll();
    } catch (e) {
      alert(e.message);
    }
  }

  async function onShare() {
    try {
      const res = await shareTrip(token, tripId);
      setShareInfo(res);
    } catch (e) {
      alert(e.message);
    }
  }

  function copyShareLink() {
    if (!shareInfo) return;
    const url = `${window.location.origin}/public/${shareInfo.share_id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading && !trip) return <div className="p-8 text-center text-gray-500">Loading trip...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!trip) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{trip.name}</h1>
            <div className="flex items-center mt-2 text-gray-500 space-x-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {trip.start_date} → {trip.end_date}
              </div>
              {trip.budget && (
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">Budget: ${trip.budget}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onShare}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Share2 size={16} className="mr-2" />
              Share
            </button>
            <button
              onClick={openCreateStopFlow}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Plus size={16} className="mr-2" />
              Add Stop
            </button>
          </div>
        </div>

        {shareInfo && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
            <div className="text-sm text-blue-800">
              <span className="font-medium">Public Link:</span> {window.location.origin}/public/{shareInfo.share_id}
            </div>
            <button onClick={copyShareLink} className="text-blue-600 hover:text-blue-800 p-1">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}
      </div>

      <TripTabs active={tab} onChange={setTab} />

      {/* Content */}
      <div className="space-y-6">
        {tab === 'itinerary' && (
          <div className="space-y-6">
            {sortedStops.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No stops added yet. Click "Add Stop" to begin.</p>
              </div>
            ) : (
              sortedStops.map((stop, idx) => (
                <div key={stop.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-3">
                        {stop.order_index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {stop.city_name || `City #${stop.city_id}`}
                          <span className="ml-2 text-sm font-normal text-gray-500">{stop.city_country}</span>
                        </h3>
                        <div className="text-sm text-gray-500">
                          {stop.start_date} - {stop.end_date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveStop(stop.id, 'up')}
                        disabled={idx === 0}
                        className={`p-1 rounded hover:bg-gray-200 ${idx === 0 ? 'text-gray-300' : 'text-gray-500'}`}
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => moveStop(stop.id, 'down')}
                        disabled={idx === sortedStops.length - 1}
                        className={`p-1 rounded hover:bg-gray-200 ${idx === sortedStops.length - 1 ? 'text-gray-300' : 'text-gray-500'}`}
                      >
                        <ArrowDown size={16} />
                      </button>
                      <div className="h-4 w-px bg-gray-300 mx-2"></div>
                      <button
                        onClick={() => setStopFormMode({ mode: 'edit', stop })}
                        className="text-sm text-gray-600 hover:text-primary flex items-center"
                      >
                        <Edit2 size={14} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStop(stop.id)}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center ml-2"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Activities</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => { setActivitySearchOpen(true); setActivityModal({ open: true, stopId: stop.id }); }}
                          className="text-sm text-primary hover:text-primary-dark font-medium inline-flex items-center"
                        >
                          <Plus size={14} className="mr-1" /> Search Activities
                        </button>
                        <button
                          onClick={() => { setActivityModal({ open: true, stopId: stop.id }); setActivityFormMode({ mode: 'create', stopId: stop.id }); }}
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium inline-flex items-center ml-2"
                        >
                          <Plus size={14} className="mr-1" /> Custom Activity
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(activitiesByStop[stop.id] || []).map((act) => (
                        <div key={act.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                          <div>
                            <div className="font-medium text-gray-900">{act.name}</div>
                            <div className="text-sm text-gray-500">
                              {act.start_time ? new Date(act.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Anytime'}
                              {act.cost > 0 && ` • $${act.cost}`}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => { setActivityModal({ open: true, stopId: stop.id }); setActivityFormMode({ mode: 'edit', stopId: stop.id, activity: act }); }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteActivity(act.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!activitiesByStop[stop.id] || activitiesByStop[stop.id].length === 0) && (
                        <p className="text-sm text-gray-400 italic">No activities planned.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'budget' && (
          <BudgetSummary
            trip={trip}
            stops={stops}
            activitiesByStop={activitiesByStop}
            expenses={expenses}
            onCreateExpense={async (payload) => {
              await createExpense(token, tripId, payload);
              loadAll();
            }}
            onDeleteExpense={async (id) => {
              await deleteExpense(token, id);
              loadAll();
            }}
          />
        )}

        {tab === 'timeline' && (
          <TimelineView trip={trip} stops={stops} activitiesByStop={activitiesByStop} />
        )}

        {tab === 'share' && (
           <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
             <Share2 size={48} className="mx-auto text-gray-300 mb-4" />
             <h3 className="text-lg font-medium text-gray-900">Share your itinerary</h3>
             <p className="text-gray-500 mb-6">Generate a public link to share your trip with friends and family.</p>
             <button
               onClick={onShare}
               className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
             >
               Generate Link
             </button>
             {shareInfo && (
                <div className="mt-6 max-w-md mx-auto">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border border-gray-200">
                    <input 
                      type="text" 
                      readOnly 
                      value={`${window.location.origin}/public/${shareInfo.share_id}`}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-600"
                    />
                    <button onClick={copyShareLink} className="text-primary hover:text-primary-dark">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="mt-4">
                    <Link to={`/public/${shareInfo.share_id}`} target="_blank" className="text-primary hover:underline text-sm">
                      Preview Public Page
                    </Link>
                  </div>
                </div>
             )}
           </div>
        )}
      </div>

      {/* Modals */}
      {cityModalOpen && (
        <CitySearchModal
          onClose={() => setCityModalOpen(false)}
          onSelect={onCitySelected}
        />
      )}

      {stopFormMode && (
        <StopForm
          mode={stopFormMode.mode}
          initialData={stopFormMode.stop}
          tripDates={{ start: trip.start_date, end: trip.end_date }}
          city={selectedCity || (stopFormMode.stop ? { name: stopFormMode.stop.city_name } : null)}
          onSave={handleSaveStop}
          onCancel={() => setStopFormMode(null)}
        />
      )}

      {activityModal.open && (
        <>
          <ActivitySearch
            open={activitySearchOpen}
            onClose={() => setActivitySearchOpen(false)}
            onPick={(suggestion) => {
              setActivitySearchOpen(false);
              setActivityFormMode({
                mode: 'create',
                stopId: activityModal.stopId,
                activity: {
                  name: suggestion.name,
                  type: suggestion.type,
                  cost: suggestion.typical_cost ?? 0,
                  duration_minutes: suggestion.typical_duration_minutes ?? null,
                },
              });
            }}
          />

          {activityFormMode && (
            <ActivityForm
              mode={activityFormMode.mode}
              initialData={activityFormMode.activity}
              onSave={(fields) => handleSaveActivity(fields)}
              onCancel={() => {
                setActivityFormMode(null);
                setActivityModal({ open: false, stopId: null });
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
