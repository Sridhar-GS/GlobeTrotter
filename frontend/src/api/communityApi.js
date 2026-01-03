import { createApiClient } from './apiClient';

export async function listCommunityPosts(limit = 50) {
  const client = createApiClient();
  const res = await client.get(`/community/posts?limit=${encodeURIComponent(limit)}`);
  return res.data;
}

export async function createCommunityPost(token, content) {
  const client = createApiClient(token);
  const res = await client.post('/community/posts', { content });
  return res.data;
}

export async function deleteCommunityPost(token, postId) {
  const client = createApiClient(token);
  const res = await client.delete(`/community/posts/${postId}`);
  return res.data;
}
