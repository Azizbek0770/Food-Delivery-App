import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
  }
);

export const getOrders = createAsyncThunk(
  'order/getOrders',
  async () => {
    const response = await api.get('/orders/');
    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (orderId) => {
    const response = await api.get(`/orders/${orderId}/`);
    return response.data;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
      }
      if (state.currentOrder?.id === orderId) {
        state.currentOrder.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  },
});

export const { updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;