import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('zelis_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from local storage or verify with /api/auth/me
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('zelis_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          localStorage.removeItem('zelis_token');
          localStorage.removeItem('zelis_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('zelis_token', newToken);
    localStorage.setItem('zelis_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('zelis_token', newToken);
    localStorage.setItem('zelis_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('zelis_token');
    localStorage.removeItem('zelis_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    setUser((prev) => ({
      ...prev,
      profile: res.data.profile,
    }));
    return res.data.profile;
  };

  const isCandidate = user?.role === 'candidate';
  const isRecruiter = user?.role === 'recruiter' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isCandidate,
        isRecruiter,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
