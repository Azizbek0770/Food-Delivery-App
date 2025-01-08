import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      try {
        const response = await api.post('/users/refresh-token');
        if (response.status === 200) {
          // Retry original request
          return api(error.config);
        }
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;