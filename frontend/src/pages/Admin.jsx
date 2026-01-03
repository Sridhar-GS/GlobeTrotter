import React, { useEffect, useState } from 'react';
import { Users, MapPin, Activity, TrendingUp, ShieldAlert } from 'lucide-react';

import { adminListUsers, adminPopularActivities, adminPopularCities, adminTripsPerMonth } from '../api/adminApi';
import { useAuth } from '../hooks/useAuth';

export default function Admin() {
  const { token, user } = useAuth();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [popularCities, setPopularCities] = useState([]);
  const [popularActivities, setPopularActivities] = useState([]);
  const [trends, setTrends] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = Boolean(user?.is_admin);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!isAdmin) {
        setLoading(false);
        return;
      }
      setError(null);
      setLoading(true);
      try {
        const [u, c, a, t] = await Promise.all([
          adminListUsers(token),
          adminPopularCities(token),
          adminPopularActivities(token),
          adminTripsPerMonth(token),
        ]);
        if (!mounted) return;
        setUsers(u);
        setPopularCities(c);
        setPopularActivities(a);
        setTrends(t);
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
  }, [token, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center">
          <ShieldAlert size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'cities', label: 'Popular Cities', icon: MapPin },
    { id: 'activities', label: 'Popular Activities', icon: Activity },
    { id: 'trends', label: 'User Trends', icon: TrendingUp },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-500">Overview of platform usage and statistics.</p>
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

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`${
                    tab === t.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon size={16} className="mr-2" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {tab === 'users' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                          {(u.first_name?.[0] || u.email[0]).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {u.first_name || u.last_name ? `${u.first_name || ''} ${u.last_name || ''}`.trim() : 'No Name'}
                          </div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {u.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Active
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'cities' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Most Popular Destinations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularCities.map((c, idx) => (
                <div key={`${c.name}-${c.country}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-400 mr-4 w-6">#{idx + 1}</span>
                    <div>
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-sm text-gray-500">{c.country}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary">{c.count}</div>
                </div>
              ))}
              {popularCities.length === 0 && <p className="text-gray-500">No data available.</p>}
            </div>
          </div>
        )}

        {tab === 'activities' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Activity Types</h3>
            <div className="space-y-4">
              {popularActivities.map((a) => (
                <div key={a.type} className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                        {a.type || 'Uncategorized'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary">
                        {a.count}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/10">
                    <div style={{ width: `${(a.count / Math.max(...popularActivities.map(x => x.count))) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                  </div>
                </div>
              ))}
              {popularActivities.length === 0 && <p className="text-gray-500">No data available.</p>}
            </div>
          </div>
        )}

        {tab === 'trends' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Trips Created Per Month</h3>
            <div className="h-64 flex items-end space-x-2">
              {trends.map((t) => {
                const max = Math.max(...trends.map(x => x.count), 1);
                const height = (t.count / max) * 100;
                return (
                  <div key={t.month} className="flex-1 flex flex-col items-center group">
                    <div 
                      className="w-full bg-primary/80 rounded-t hover:bg-primary transition-all relative"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {t.count}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 rotate-45 origin-left translate-y-2">{t.month}</div>
                  </div>
                );
              })}
              {trends.length === 0 && <p className="text-gray-500 w-full text-center self-center">No trend data available.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
