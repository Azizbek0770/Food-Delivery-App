import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import restaurantReducer from './slices/restaurantSlice';
import adminReducer from './slices/adminSlice';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import uiReducer from './slices/uiSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  orders: orderReducer,
  restaurants: restaurantReducer,
  admin: adminReducer,
  users: userReducer,
  cart: cartReducer,
  ui: uiReducer,
});

export default rootReducer;