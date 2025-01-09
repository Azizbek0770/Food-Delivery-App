import { showToast } from '../slices/uiSlice';

export const errorMiddleware = (store) => (next) => (action) => {
  // Xatolik yuz berganda
  if (action.type.endsWith('/rejected')) {
    const error = action.error;
    store.dispatch(showToast({
      type: 'error',
      message: error.message || 'Xatolik yuz berdi'
    }));
  }
  
  return next(action);
};