import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async actions
export const getActiveDeliveries = createAsyncThunk(
  'delivery/getActiveDeliveries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/delivery/active-deliveries/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDeliveryStatus = createAsyncThunk(
  'delivery/updateStatus',
  async ({ deliveryId, status }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/delivery/deliveries/${deliveryId}/status/`, {
        status
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLocation = createAsyncThunk(
  'delivery/updateLocation',
  async (location, { rejectWithValue }) => {
    try {
      const response = await api.post('/delivery/update-location/', location);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleAvailability = createAsyncThunk(
  'delivery/toggleAvailability',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/delivery/toggle-availability/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDeliveryStatistics = createAsyncThunk(
  'delivery/getStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/delivery/statistics/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const deliverySlice = createSlice({
  name: 'delivery',
  initialState: {
    activeDeliveries: [],
    currentDelivery: null,
    statistics: null,
    loading: false,
    error: null,
    locationUpdateError: null,
    lastLocationUpdate: null
  },
  reducers: {
    setCurrentDelivery: (state, action) => {
      state.currentDelivery = action.payload;
    },
    updateDeliveryInList: (state, action) => {
      const index = state.activeDeliveries.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.activeDeliveries[index] = action.payload;
      }
    },
    removeDeliveryFromList: (state, action) => {
      state.activeDeliveries = state.activeDeliveries.filter(
        d => d.id !== action.payload
      );
    }
  },
  extraReducers: (builder) => {
    builder
      // getActiveDeliveries
      .addCase(getActiveDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.activeDeliveries = action.payload;
      })
      .addCase(getActiveDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateDeliveryStatus
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        const updatedDelivery = action.payload;
        const index = state.activeDeliveries.findIndex(d => d.id === updatedDelivery.id);
        if (index !== -1) {
          state.activeDeliveries[index] = updatedDelivery;
        }
        if (state.currentDelivery?.id === updatedDelivery.id) {
          state.currentDelivery = updatedDelivery;
        }
      })

      // updateLocation
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.lastLocationUpdate = new Date().toISOString();
        state.locationUpdateError = null;
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.locationUpdateError = action.payload;
      })

      // toggleAvailability
      .addCase(toggleAvailability.fulfilled, (state, action) => {
        // Update delivery person status if needed
      })

      // getDeliveryStatistics
      .addCase(getDeliveryStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });
  }
});

export const { 
  setCurrentDelivery, 
  updateDeliveryInList, 
  removeDeliveryFromList 
} = deliverySlice.actions;

export default deliverySlice.reducer;