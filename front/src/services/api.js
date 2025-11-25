// // src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/', data),  
  changePassword: (data) => api.post('/auth/profile/change-password/', data),
  deleteAccount: (data) => api.delete('/auth/delete-account/', { data }),
};

export const projectsAPI = {
  getAll: () => api.get('/projects/'),
  getMyProjects: () => api.get('/projects/my-projects/'),
  get: (id) => api.get(`/projects/${id}/`),
  create: (data) => api.post('/projects/', data),
  update: (id, data) => api.put(`/projects/${id}/`, data),
  delete: (id) => api.delete(`/projects/${id}/`),
  search: (date) => api.get(`/projects/search/?date=${date}`),
};

export default api;