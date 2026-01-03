import axios from 'axios';

export function createApiClient(token) {
  const client = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  client.interceptors.response.use(
    (r) => r,
    (err) => {
      const message = err?.response?.data?.detail || err.message || 'Request failed';
      return Promise.reject(new Error(message));
    }
  );

  return client;
}
