import { createApiClient } from './apiClient';

export async function searchAttractions(token, query, cityId) {
  const client = createApiClient(token);
  const params = {};
  if (query) params.query = query;
  if (cityId) params.city_id = cityId;
  
  const res = await client.get('/attractions', { params });
  return res.data;
}

export async function getAttraction(token, id) {
  const client = createApiClient(token);
  const res = await client.get(`/attractions/${id}`);
  return res.data;
}
