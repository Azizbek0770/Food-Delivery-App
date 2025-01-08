import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import orderReducer from './features/orderSlice';
import restaurantReducer from './features/restaurantSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    restaurants: restaurantReducer,
  },
});
