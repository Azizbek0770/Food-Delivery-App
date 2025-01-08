import api from './api';

const restaurantApi = {
  // Restaurant
  getRestaurants: () => api.get('/restaurants/'),
  getRestaurantById: (id) => api.get(`/restaurants/${id}/`),
  createRestaurant: (data) => api.post('/restaurants/', data),
  updateRestaurant: (id, data) => api.patch(`/restaurants/${id}/`, data),
  deleteRestaurant: (id) => api.delete(`/restaurants/${id}/`),
  getDashboard: (id) => api.get(`/restaurants/${id}/dashboard/`),
  toggleStatus: (id) => api.post(`/restaurants/${id}/toggle-status/`),

  // Categories
  getCategories: (restaurantId) => 
    api.get(`/restaurants/${restaurantId}/categories/`),
  createCategory: (restaurantId, data) => 
    api.post(`/restaurants/${restaurantId}/categories/`, data),
  updateCategory: (restaurantId, categoryId, data) => 
    api.patch(`/restaurants/${restaurantId}/categories/${categoryId}/`, data),
  deleteCategory: (restaurantId, categoryId) => 
    api.delete(`/restaurants/${restaurantId}/categories/${categoryId}/`),

  // Products
  getProducts: (restaurantId) => 
    api.get(`/restaurants/${restaurantId}/products/`),
  createProduct: (restaurantId, data) => 
    api.post(`/restaurants/${restaurantId}/products/`, data),
  updateProduct: (restaurantId, productId, data) => 
    api.patch(`/restaurants/${restaurantId}/products/${productId}/`, data),
  deleteProduct: (restaurantId, productId) => 
    api.delete(`/restaurants/${restaurantId}/products/${productId}/`),

  // Working Hours
  getWorkingHours: (restaurantId) => 
    api.get(`/restaurants/${restaurantId}/working-hours/`),
  updateWorkingHours: (restaurantId, data) => 
    api.put(`/restaurants/${restaurantId}/working-hours/`, data),

  // Reviews
  getReviews: (restaurantId) => 
    api.get(`/restaurants/${restaurantId}/reviews/`),
  createReview: (restaurantId, data) => 
    api.post(`/restaurants/${restaurantId}/reviews/`, data),
};

export default restaurantApi;