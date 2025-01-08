import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { apiMiddleware } from './middleware/apiMiddleware';
import { errorMiddleware } from './middleware/errorMiddleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([apiMiddleware, errorMiddleware]),
});