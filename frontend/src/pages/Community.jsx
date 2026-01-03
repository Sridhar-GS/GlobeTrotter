import React, { useEffect, useState } from 'react';

import { createCommunityPost, deleteCommunityPost, listCommunityPosts } from '../api/communityApi';
import { useAuth } from '../hooks/useAuth';

function formatDate(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

export default function Community() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await listCommunityPosts(50);
      setPosts(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onPost() {
    if (!token) return;
    const text = content.trim();
    if (!text) return;

    try {
      const created = await createCommunityPost(token, text);
      setPosts((prev) => [created, ...prev]);
      setContent('');
    } catch (e) {
      alert(e.message);
    }
  }

  async function onDelete(postId) {
    if (!token) return;
    if (!window.confirm('Delete this post?')) return;

    try {
      await deleteCommunityPost(token, postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="col">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <strong>Community tab</strong>
          <div className="row">
            <button className="button secondary" type="button">Group by</button>
            <button className="button secondary" type="button">Filter</button>
            <button className="button secondary" type="button">Sort by…</button>
          </div>
        </div>
        <div style={{ marginTop: 10 }} className="row">
          <input className="input" placeholder="Search bar…" disabled />
        </div>
        <div className="small" style={{ marginTop: 10 }}>
          Community section where users can share experiences about a trip or activity.
        </div>

        {token ? (
          <div style={{ marginTop: 12 }} className="col">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div className="avatar" aria-hidden />
              <div style={{ flex: 1 }} className="col">
                <textarea
                  className="input"
                  rows={3}
                  placeholder={user?.name ? `Share something, ${user.name}…` : 'Share something…'}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="row" style={{ justifyContent: 'flex-end' }}>
                  <button className="button" type="button" onClick={onPost}>Post</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="small" style={{ marginTop: 10 }}>Login to post.</div>
        )}

        {error ? <div className="error" style={{ marginTop: 10 }}>{error}</div> : null}
        {loading ? <div className="small" style={{ marginTop: 10 }}>Loading…</div> : null}
      </div>

      <div className="col">
        {posts.map((p) => (
          <div className="card" key={p.id}>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div className="avatar" aria-hidden />
              <div style={{ flex: 1 }} className="col">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.user?.name || 'Traveler'}</div>
                    <div className="small">{formatDate(p.created_at)}</div>
                  </div>
                  {token && (p.user?.id === user?.id || user?.is_admin) ? (
                    <button className="button danger" type="button" onClick={() => onDelete(p.id)}>Delete</button>
                  ) : null}
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{p.content}</div>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && !loading ? <div className="card"><div className="small">No posts yet.</div></div> : null}
      </div>
    </div>
  );
}
