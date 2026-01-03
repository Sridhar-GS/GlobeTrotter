import { createApiClient } from './apiClient';

export async function listExpenses(token, tripId) {
  const client = createApiClient(token);
  const res = await client.get(`/expenses/trips/${tripId}`);
  return res.data;
}

export async function createExpense(token, tripId, payload) {
  const client = createApiClient(token);
  const res = await client.post(`/expenses/trips/${tripId}`, payload);
  return res.data;
}

export async function updateExpense(token, expenseId, payload) {
  const client = createApiClient(token);
  const res = await client.patch(`/expenses/${expenseId}`, payload);
  return res.data;
}

export async function deleteExpense(token, expenseId) {
  const client = createApiClient(token);
  const res = await client.delete(`/expenses/${expenseId}`);
  return res.data;
}
