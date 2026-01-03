import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { getMe } from '../api/authApi';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'globetrotter_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const loginWithToken = useCallback((newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!token) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const me = await getMe(token);
        if (mounted) setUser(me);
      } catch (e) {
        logout();
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [token, logout]);

  const value = useMemo(
    () => ({ token, user, loading, loginWithToken, logout, setUser }),
    [token, user, loading, loginWithToken, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
