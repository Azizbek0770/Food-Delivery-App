import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getRestaurants = createAsyncThunk(
  'restaurant/getRestaurants',
  async (params) => {
    const response = await api.get('/restaurants/', { params });
    return response.data;
  }
);

export const getRestaurantDetails = createAsyncThunk(
  'restaurant/getRestaurantDetails',
  async (id) => {
    const response = await api.get(`/restaurants/${id}/`);
    return response.data;
  }
);

export const getRestaurantMenu = createAsyncThunk(
  'restaurant/getRestaurantMenu',
  async (id) => {
    const response = await api.get(`/restaurants/${id}/menu/`);
    return response.data;
  }
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: {
    restaurants: [],
    currentRestaurant: null,
    menu: [],
    loading: false,
    error: null,
    filters: {
      category: null,
      search: '',
      sorting: 'rating',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        search: '',
        sorting: 'rating',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(getRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getRestaurantDetails.fulfilled, (state, action) => {
        state.currentRestaurant = action.payload;
      })
      .addCase(getRestaurantMenu.fulfilled, (state, action) => {
        state.menu = action.payload;
      });
  },
});

export const { setFilters, clearFilters } = restaurantSlice.actions;
export default restaurantSlice.reducer;