import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Token muddati tugagan
      if (error.response.status === 401) {
        store.dispatch(logout());
        store.dispatch(showToast({
          type: 'error',
          message: 'Sessiya muddati tugadi. Qaytadan kiring.'
        }));
      }
      
      // Server xatoligi
      if (error.response.status >= 500) {
        store.dispatch(showToast({
          type: 'error',
          message: 'Server xatosi yuz berdi. Iltimos keyinroq urinib ko\'ring.'
        }));
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;