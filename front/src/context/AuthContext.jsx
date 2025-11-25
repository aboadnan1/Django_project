// // src/context/AuthContext.jsx


import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      authAPI.getProfile()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { access, refresh, user } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access, refresh, user } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    try {
      await authAPI.updateProfile(data);
      const response = await authAPI.getProfile();
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async (password) => {
    try {
      await authAPI.deleteAccount({ password });
      logout();
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    register,
    login,
    logout,
    updateProfile,
    deleteAccount, // ⬅️ جديد
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};