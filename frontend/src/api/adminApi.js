import { createApiClient } from './apiClient';

export async function adminListUsers(token) {
  const client = createApiClient(token);
  const res = await client.get('/admin/users');
  return res.data;
}

export async function adminPopularCities(token) {
  const client = createApiClient(token);
  const res = await client.get('/admin/analytics/popular-cities');
  return res.data;
}

export async function adminPopularActivities(token) {
  const client = createApiClient(token);
  const res = await client.get('/admin/analytics/popular-activities');
  return res.data;
}

export async function adminTripsPerMonth(token) {
  const client = createApiClient(token);
  const res = await client.get('/admin/analytics/trips-per-month');
  return res.data;
}
