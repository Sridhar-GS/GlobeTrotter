import { createApiClient } from './apiClient';

export async function signup(payload) {
  const client = createApiClient();
  const res = await client.post('/auth/signup', payload);
  return res.data;
}

export async function login({ email, password }) {
  const client = createApiClient();
  const res = await client.post('/auth/login', { email, password });
  return res.data;
}

export async function getMe(token) {
  const client = createApiClient(token);
  const res = await client.get('/users/me');
  return res.data;
}

export async function updateMe(token, payload) {
  const client = createApiClient(token);
  const res = await client.patch('/users/me', payload);
  return res.data;
}
