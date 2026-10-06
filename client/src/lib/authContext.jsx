import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from './api.js';
import { useTranslation } from 'react-i18next';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('artify_token'));
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  // Load user profile if token is present
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiFetch('/api/me');
        if (res.success && res.user) {
          setUser(res.user);
          if (res.user.uiLanguage) {
            i18n.changeLanguage(res.user.uiLanguage);
          }
        }
      } catch (err) {
        console.warn('Stored token invalid or expired, clearing session:', err.message);
        localStorage.removeItem('artify_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token, i18n]);

  // Login using verified Firebase ID token or demo test token
  const loginWithToken = async (firebaseIdToken, uiLanguage = i18n.language) => {
    const res = await apiFetch('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ firebaseIdToken, uiLanguage })
    });

    if (res.success && res.token) {
      localStorage.setItem('artify_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.user.uiLanguage) {
        i18n.changeLanguage(res.user.uiLanguage);
      }
      return res.user;
    }
    throw new Error(res.error?.message || 'Login failed');
  };

  // Demo shortcut login for quick hackathon presentation
  const loginWithDemo = async (phoneNumber = '+919876543201') => {
    const demoToken = `test_token_${phoneNumber}`;
    return await loginWithToken(demoToken, i18n.language);
  };

  // Update artisan profile
  const updateProfile = async (profileData) => {
    const res = await apiFetch('/api/me/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });

    if (res.success && res.profile) {
      setUser(prev => ({
        ...prev,
        profile: res.profile
      }));
      return res.profile;
    }
    throw new Error(res.error?.message || 'Failed to update profile');
  };

  const logout = () => {
    localStorage.removeItem('artify_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: Boolean(user),
      loading,
      loginWithToken,
      loginWithDemo,
      updateProfile,
      logout
    }}>
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
