import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  }
);

export const updateSettings = createAsyncThunk(
  'admin/updateSettings',
  async (settings) => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  }
);

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (filters) => {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboardStats: null,
    settings: null,
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;