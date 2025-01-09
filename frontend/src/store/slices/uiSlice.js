import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    activeModal: null,
    toast: null,
    theme: 'light',
    loading: {
      global: false,
      requests: {},
    },
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    showModal: (state, action) => {
      state.activeModal = action.payload;
    },
    hideModal: (state) => {
      state.activeModal = null;
    },
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = null;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      const { requestId, loading } = action.payload;
      if (requestId) {
        state.loading.requests[requestId] = loading;
      } else {
        state.loading.global = loading;
      }
    },
  },
});

export const {
  toggleSidebar,
  showModal,
  hideModal,
  showToast,
  hideToast,
  setTheme,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;