import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/users/login/', credentials);
  return response.data;
};

export const register = async (data) => {
  const response = await api.post('/users/register/', data);
  return response.data;
};
