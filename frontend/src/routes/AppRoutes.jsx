import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import MyTrips from '../pages/MyTrips';
import CreateTrip from '../pages/CreateTrip';
import TripDetail from '../pages/TripDetail';
import PublicTrip from '../pages/PublicTrip';
import Profile from '../pages/Profile';
import CitySearch from '../pages/CitySearch';
import ActivitySearch from '../pages/ActivitySearch';
import Community from '../pages/Community';
import Calendar from '../pages/Calendar';
import Admin from '../pages/Admin';

import { useAuth } from '../hooks/useAuth';

function Protected({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AdminOnly({ children }) {
  const { token, user, loading } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (loading) return <div className="card">Loading...</div>;
  if (!user?.is_admin) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />

      <Route
        path="/trips"
        element={
          <Protected>
            <MyTrips />
          </Protected>
        }
      />

      <Route
        path="/search/cities"
        element={
          <Protected>
            <CitySearch />
          </Protected>
        }
      />

      <Route
        path="/search/activities"
        element={
          <Protected>
            <ActivitySearch />
          </Protected>
        }
      />

      <Route
        path="/community"
        element={
          <Protected>
            <Community />
          </Protected>
        }
      />

      <Route
        path="/calendar"
        element={
          <Protected>
            <Calendar />
          </Protected>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminOnly>
            <Admin />
          </AdminOnly>
        }
      />
      <Route
        path="/trips/new"
        element={
          <Protected>
            <CreateTrip />
          </Protected>
        }
      />
      <Route
        path="/trips/:tripId"
        element={
          <Protected>
            <TripDetail />
          </Protected>
        }
      />
      <Route path="/public/:shareId" element={<PublicTrip />} />
      <Route
        path="/profile"
        element={
          <Protected>
            <Profile />
          </Protected>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
