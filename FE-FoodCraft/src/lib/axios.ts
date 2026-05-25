import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error object based on Modul 6
    if (error.response) {
      const { status, data } = error.response;
      
      // Auto-logout on 401
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optional: Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      // Append standard fields to the error object for easy access in catch blocks
      error.message = data.message || error.message;
      error.errors = data.errors || null;
    }
    
    return Promise.reject(error);
  }
);

export default api;
