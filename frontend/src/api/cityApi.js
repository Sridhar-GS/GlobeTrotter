import { createApiClient } from './apiClient';

export async function searchCities(query) {
  const client = createApiClient();
  const res = await client.get('/cities', { params: query ? { query } : {} });
  return res.data;
}

export async function topCities(limit = 8) {
  const client = createApiClient();
  const res = await client.get('/cities/top', { params: { limit } });
  return res.data;
}
