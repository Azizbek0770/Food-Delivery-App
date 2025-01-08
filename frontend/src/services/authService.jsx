import api from '../utils/axios';

export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/users/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/user');
  return response.data;
};