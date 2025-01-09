import { setLoading } from '../slices/uiSlice';

export const apiMiddleware = (store) => (next) => (action) => {
  // Async action bo'lsa
  if (action.type.endsWith('/pending')) {
    const requestId = action.meta?.requestId;
    store.dispatch(setLoading({ requestId, loading: true }));
  }
  
  // Async action tugasa
  if (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')) {
    const requestId = action.meta?.requestId;
    store.dispatch(setLoading({ requestId, loading: false }));
  }
  
  return next(action);
};