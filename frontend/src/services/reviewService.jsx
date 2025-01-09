import api from '../utils/api';

export const getReviews = async (restaurantId) => {
  const response = await api.get(`/restaurants/reviews/`, {
    params: { restaurant: restaurantId }
  });
  return response.data;
};

export const createReview = async (restaurantId, reviewData) => {
  const response = await api.post('/restaurants/reviews/', {
    restaurant: restaurantId,
    ...reviewData
  });
  return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(`/restaurants/reviews/${reviewId}/`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  await api.delete(`/restaurants/reviews/${reviewId}/`);
};