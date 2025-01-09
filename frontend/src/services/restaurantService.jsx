import api from '../utils/api';

export const getRestaurants = async () => {
  const response = await api.get('/restaurants/restaurants/');
  return response.data;
};

export const getRestaurantDetails = async (id) => {
  const response = await api.get(`/restaurants/restaurants/${id}/`);
  return response.data;
};

export const getMenuItems = async (restaurantId) => {
  const response = await api.get(`/restaurants/menu-items/`, {
    params: { restaurant: restaurantId }
  });
  return response.data;
};

export const createMenuItem = async (data) => {
  const response = await api.post('/restaurants/menu-items/', data);
  return response.data;
};

export const updateMenuItem = async (id, data) => {
  const response = await api.put(`/restaurants/menu-items/${id}/`, data);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  await api.delete(`/restaurants/menu-items/${id}/`);
};