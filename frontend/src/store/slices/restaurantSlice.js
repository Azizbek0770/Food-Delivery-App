import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async (filters) => {
    const response = await api.get('/restaurants', { params: filters });
    return response.data;
  }
);

export const fetchRestaurantDetails = createAsyncThunk(
  'restaurants/fetchRestaurantDetails',
  async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  }
);

export const updateRestaurant = createAsyncThunk(
  'restaurants/updateRestaurant',
  async ({ id, data }) => {
    const response = await api.put(`/restaurants/${id}`, data);
    return response.data;
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState: {
    items: [],
    currentRestaurant: null,
    loading: false,
    error: null,
    filters: {
      category: 'all',
      rating: 0,
      priceRange: 'all',
      search: '',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRestaurantDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearError } = restaurantSlice.actions;
export default restaurantSlice.reducer;