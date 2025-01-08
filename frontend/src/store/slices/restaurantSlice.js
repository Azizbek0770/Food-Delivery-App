import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import restaurantApi from '../../services/restaurantApi';

// Async actions
export const fetchRestaurantDashboard = createAsyncThunk(
  'restaurant/fetchDashboard',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await restaurantApi.getDashboard(restaurantId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'restaurant/fetchCategories',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await restaurantApi.getCategories(restaurantId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'restaurant/fetchProducts',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await restaurantApi.getProducts(restaurantId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'restaurant/updateProduct',
  async ({ restaurantId, productId, data }, { rejectWithValue }) => {
    try {
      const response = await restaurantApi.updateProduct(restaurantId, productId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleRestaurantStatus = createAsyncThunk(
  'restaurant/toggleStatus',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await restaurantApi.toggleStatus(restaurantId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: {
    dashboard: null,
    categories: [],
    products: [],
    workingHours: [],
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateProductAvailability(state, action) {
      const { productId, isAvailable } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.is_available = isAvailable;
      }
    },
    updateCategory(state, action) {
      const updatedCategory = action.payload;
      const index = state.categories.findIndex(c => c.id === updatedCategory.id);
      if (index !== -1) {
        state.categories[index] = updatedCategory;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchRestaurantDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchRestaurantDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      
      // Products
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  },
});

export const { updateProductAvailability, updateCategory } = restaurantSlice.actions;

export default restaurantSlice.reducer;