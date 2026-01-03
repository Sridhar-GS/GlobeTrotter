import { createApiClient } from './apiClient';

export async function listTrips(token) {
  const client = createApiClient(token);
  const res = await client.get('/trips');
  return res.data;
}

export async function createTrip(token, payload) {
  const client = createApiClient(token);
  const res = await client.post('/trips', payload);
  return res.data;
}

export async function getTrip(token, tripId) {
  const client = createApiClient(token);
  const res = await client.get(`/trips/${tripId}`);
  return res.data;
}

export async function deleteTrip(token, tripId) {
  const client = createApiClient(token);
  const res = await client.delete(`/trips/${tripId}`);
  return res.data;
}

export async function listStops(token, tripId) {
  const client = createApiClient(token);
  const res = await client.get(`/trips/${tripId}/stops`);
  return res.data;
}

export async function createStop(token, tripId, payload) {
  const client = createApiClient(token);
  const res = await client.post(`/trips/${tripId}/stops`, payload);
  return res.data;
}

export async function updateStop(token, stopId, payload) {
  const client = createApiClient(token);
  const res = await client.patch(`/stops/${stopId}`, payload);
  return res.data;
}

export async function deleteStop(token, stopId) {
  const client = createApiClient(token);
  const res = await client.delete(`/stops/${stopId}`);
  return res.data;
}

export async function listActivities(token, stopId) {
  const client = createApiClient(token);
  const res = await client.get(`/stops/${stopId}/activities`);
  return res.data;
}

export async function createActivity(token, stopId, payload) {
  const client = createApiClient(token);
  const res = await client.post(`/stops/${stopId}/activities`, payload);
  return res.data;
}

export async function updateActivity(token, activityId, payload) {
  const client = createApiClient(token);
  const res = await client.patch(`/activities/${activityId}`, payload);
  return res.data;
}

export async function deleteActivity(token, activityId) {
  const client = createApiClient(token);
  const res = await client.delete(`/activities/${activityId}`);
  return res.data;
}

export async function getBudget(token, tripId, budgetLimit) {
  const client = createApiClient(token);
  const res = await client.get(`/budget/trips/${tripId}`, { params: budgetLimit ? { budget_limit: budgetLimit } : {} });
  return res.data;
}

export async function shareTrip(token, tripId) {
  const client = createApiClient(token);
  const res = await client.post(`/share/trips/${tripId}`);
  return res.data;
}

export async function getPublicTrip(shareId) {
  const client = createApiClient();
  const res = await client.get(`/public/${shareId}`);
  return res.data;
}

export async function copyPublicTrip(token, shareId) {
  const client = createApiClient(token);
  const res = await client.post(`/public/${shareId}/copy`);
  return res.data;
}
