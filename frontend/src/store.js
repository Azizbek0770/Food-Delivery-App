import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/slices/authSlice';
import orderReducer from './store/slices/orderSlice';
import restaurantReducer from './store/slices/restaurantSlice';
import adminReducer from './store/slices/adminSlice';
import userReducer from './store/slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    restaurants: restaurantReducer,
    admin: adminReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});